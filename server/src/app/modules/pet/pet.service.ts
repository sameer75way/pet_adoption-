import { Pet, IPet, PetStatus } from "./pet.model";
import cloudinary from "../../common/config/cloudinary.config";

/**
 * Generate Intake ID
 */
const generateIntakeId = async (): Promise<string> => {
  const count = await Pet.countDocuments();
  return `PET-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
};

/**
 * Create Pet
 */
export const createPet = async (data: Partial<IPet>) => {

  const intakeId = await generateIntakeId();

  const pet = await Pet.create({
    ...data,
    intakeId
  });

  return pet;
};

/**
 * Get Pets (Advanced Search)
 */
export const getPets = async (queryParams: any) => {

  const {
    species,
    status,
    search,
    breed,
    size,
    ageMin,
    ageMax,
    lat,
    lng,
    radius,
    page = 1,
    limit = 12,
    sort = "createdAt",
    order = "desc"
  } = queryParams;

  // Use flexible but safe object
  const query: Record<string, any> = {
    deletedAt: null
  };

  /**
   * Filters
   */
  if (species) query.species = species;
  if (status) query.status = status;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { breed: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  if (breed) {
    query.breed = { $regex: breed, $options: "i" };
  }

  if (size) {
    query.size = { $in: size.split(",") };
  }

  /**
   * Age Filter
   */
  if (ageMin || ageMax) {

    query["age.years"] = {};

    if (ageMin) query["age.years"].$gte = Number(ageMin);
    if (ageMax) query["age.years"].$lte = Number(ageMax);

  }

  /**
   * Geo Search
   */
  if (lat && lng && radius) {

    query["shelter.location"] = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [Number(lng), Number(lat)]
        },
        $maxDistance: Number(radius) * 1000
      }
    };

  }

  const skip = (Number(page) - 1) * Number(limit);

  const pets = await Pet.find(query)
    .sort({
      [sort]: order === "asc" ? 1 : -1
    })
    .skip(skip)
    .limit(Number(limit));

  const total = await Pet.countDocuments(query);

  return {
    data: pets,
    totalPages: Math.max(1, Math.ceil(total / Number(limit))),
    currentPage: Number(page),
    meta: {
      total,
      page: Number(page),
      limit: Number(limit)
    }
  };
};

/**
 * Get Pet By ID
 */
export const getPetById = async (id: string) => {

  const pet = await Pet.findOne({
    _id: id,
    deletedAt: null
  });

  if (!pet) {
    throw new Error("Pet not found");
  }

  return pet;
};

/**
 * Update Pet
 */
export const updatePet = async (id: string, data: Partial<IPet>) => {

  const pet = await Pet.findOne({
    _id: id,
    deletedAt: null
  });

  if (!pet) throw new Error("Pet not found");

  Object.assign(pet, data);

  await pet.save();

  return pet;
};

/**
 * Soft Delete Pet
 */
export const deletePet = async (id: string) => {

  const pet = await Pet.findOne({
    _id: id,
    deletedAt: null
  });

  if (!pet) throw new Error("Pet not found");

  pet.deletedAt = new Date();

  await pet.save();

  return { message: "Pet deleted" };
};

/**
 * STATUS LIFECYCLE RULES
 */
const allowedTransitions: Record<PetStatus, PetStatus[]> = {
  intake: ["medical_hold"],
  medical_hold: ["available"],
  available: ["adoption_pending", "foster_placed"],
  adoption_pending: ["adopted"],
  adopted: [],
  foster_placed: ["available"]
};

/**
 * Update Pet Status (STRICT FLOW)
 */
export const updatePetStatus = async (
  id: string,
  newStatus: PetStatus
) => {

  const pet = await Pet.findOne({
    _id: id,
    deletedAt: null
  });

  if (!pet) throw new Error("Pet not found");

  const currentStatus = pet.status;

  const allowed = allowedTransitions[currentStatus];

  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${currentStatus} → ${newStatus}`
    );
  }

  pet.status = newStatus;

  if (newStatus === "adopted") {
    pet.adoptedAt = new Date();
  }

  await pet.save();

  return pet;
};

/**
 * Add Photo
 */
export const addPetPhoto = async (
  petId: string,
  file: any
) => {

  const pet = await Pet.findOne({
    _id: petId,
    deletedAt: null
  });

  if (!pet) throw new Error("Pet not found");

  pet.photos.push({
    url: file.path,
    publicId: file.filename,
    isPrimary: pet.photos.length === 0
  });

  await pet.save();

  return pet;
};

/**
 * Delete Photo
 */
export const deletePetPhoto = async (
  petId: string,
  publicId: string
) => {

  const pet = await Pet.findOne({
    _id: petId,
    deletedAt: null
  });

  if (!pet) throw new Error("Pet not found");

  const photoToDelete = pet.photos.find(
    (photo) => photo.publicId === publicId
  );

  if (!photoToDelete) {
    throw new Error("Photo not found");
  }

  await cloudinary.uploader.destroy(publicId);

  pet.photos = pet.photos.filter(
    (p: any) => p.publicId !== publicId
  );

  if (photoToDelete.isPrimary && pet.photos.length > 0) {
    pet.photos[0].isPrimary = true;
  }

  await pet.save();

  return pet;
};

/**
 * Set Primary Photo
 */
export const setPrimaryPhoto = async (
  petId: string,
  photoId: string
) => {

  const pet = await Pet.findOne({
    _id: petId,
    deletedAt: null
  });

  if (!pet) throw new Error("Pet not found");

  // Remove primary from all photos
  pet.photos.forEach((photo) => {
    photo.isPrimary = false;
  });

  // Set selected as primary
  const targetPhoto = pet.photos.find(
    (photo) => photo.publicId === photoId
  );

  if (!targetPhoto) {
    throw new Error("Photo not found");
  }

  targetPhoto.isPrimary = true;

  await pet.save();

  return pet;
};
