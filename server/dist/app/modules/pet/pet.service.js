"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPrimaryPhoto = exports.deletePetPhoto = exports.addPetPhoto = exports.updatePetStatus = exports.deletePet = exports.updatePet = exports.getPetById = exports.getPets = exports.createPet = void 0;
const pet_model_1 = require("./pet.model");
const cloudinary_config_1 = __importDefault(require("../../common/config/cloudinary.config"));
/**
 * Generate Intake ID
 */
const generateIntakeId = async () => {
    const count = await pet_model_1.Pet.countDocuments();
    return `PET-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
};
/**
 * Create Pet
 */
const createPet = async (data) => {
    const intakeId = await generateIntakeId();
    const pet = await pet_model_1.Pet.create({
        ...data,
        intakeId
    });
    return pet;
};
exports.createPet = createPet;
/**
 * Get Pets (Advanced Search)
 */
const getPets = async (queryParams) => {
    const { species, status, search, breed, size, ageMin, ageMax, lat, lng, radius, page = 1, limit = 12, sort = "createdAt", order = "desc" } = queryParams;
    // Use flexible but safe object
    const query = {
        deletedAt: null
    };
    /**
     * Filters
     */
    if (species)
        query.species = species;
    if (status)
        query.status = status;
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
        if (ageMin)
            query["age.years"].$gte = Number(ageMin);
        if (ageMax)
            query["age.years"].$lte = Number(ageMax);
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
    const pets = await pet_model_1.Pet.find(query)
        .sort({
        [sort]: order === "asc" ? 1 : -1
    })
        .skip(skip)
        .limit(Number(limit));
    const total = await pet_model_1.Pet.countDocuments(query);
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
exports.getPets = getPets;
/**
 * Get Pet By ID
 */
const getPetById = async (id) => {
    const pet = await pet_model_1.Pet.findOne({
        _id: id,
        deletedAt: null
    });
    if (!pet) {
        throw new Error("Pet not found");
    }
    return pet;
};
exports.getPetById = getPetById;
/**
 * Update Pet
 */
const updatePet = async (id, data) => {
    const pet = await pet_model_1.Pet.findOne({
        _id: id,
        deletedAt: null
    });
    if (!pet)
        throw new Error("Pet not found");
    Object.assign(pet, data);
    await pet.save();
    return pet;
};
exports.updatePet = updatePet;
/**
 * Soft Delete Pet
 */
const deletePet = async (id) => {
    const pet = await pet_model_1.Pet.findOne({
        _id: id,
        deletedAt: null
    });
    if (!pet)
        throw new Error("Pet not found");
    pet.deletedAt = new Date();
    await pet.save();
    return { message: "Pet deleted" };
};
exports.deletePet = deletePet;
/**
 * STATUS LIFECYCLE RULES
 */
const allowedTransitions = {
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
const updatePetStatus = async (id, newStatus) => {
    const pet = await pet_model_1.Pet.findOne({
        _id: id,
        deletedAt: null
    });
    if (!pet)
        throw new Error("Pet not found");
    const currentStatus = pet.status;
    const allowed = allowedTransitions[currentStatus];
    if (!allowed.includes(newStatus)) {
        throw new Error(`Invalid status transition: ${currentStatus} → ${newStatus}`);
    }
    pet.status = newStatus;
    if (newStatus === "adopted") {
        pet.adoptedAt = new Date();
    }
    await pet.save();
    return pet;
};
exports.updatePetStatus = updatePetStatus;
/**
 * Add Photo
 */
const addPetPhoto = async (petId, file) => {
    const pet = await pet_model_1.Pet.findOne({
        _id: petId,
        deletedAt: null
    });
    if (!pet)
        throw new Error("Pet not found");
    pet.photos.push({
        url: file.path,
        publicId: file.filename,
        isPrimary: pet.photos.length === 0
    });
    await pet.save();
    return pet;
};
exports.addPetPhoto = addPetPhoto;
/**
 * Delete Photo
 */
const deletePetPhoto = async (petId, publicId) => {
    const pet = await pet_model_1.Pet.findOne({
        _id: petId,
        deletedAt: null
    });
    if (!pet)
        throw new Error("Pet not found");
    const photoToDelete = pet.photos.find((photo) => photo.publicId === publicId);
    if (!photoToDelete) {
        throw new Error("Photo not found");
    }
    await cloudinary_config_1.default.uploader.destroy(publicId);
    pet.photos = pet.photos.filter((p) => p.publicId !== publicId);
    if (photoToDelete.isPrimary && pet.photos.length > 0) {
        pet.photos[0].isPrimary = true;
    }
    await pet.save();
    return pet;
};
exports.deletePetPhoto = deletePetPhoto;
/**
 * Set Primary Photo
 */
const setPrimaryPhoto = async (petId, photoId) => {
    const pet = await pet_model_1.Pet.findOne({
        _id: petId,
        deletedAt: null
    });
    if (!pet)
        throw new Error("Pet not found");
    // Remove primary from all photos
    pet.photos.forEach((photo) => {
        photo.isPrimary = false;
    });
    // Set selected as primary
    const targetPhoto = pet.photos.find((photo) => photo.publicId === photoId);
    if (!targetPhoto) {
        throw new Error("Photo not found");
    }
    targetPhoto.isPrimary = true;
    await pet.save();
    return pet;
};
exports.setPrimaryPhoto = setPrimaryPhoto;
//# sourceMappingURL=pet.service.js.map