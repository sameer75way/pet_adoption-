import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import bcrypt from "bcrypt";
import { connectDB } from "../app/common/config/db.config";
import { Pet } from "../app/modules/pet/pet.model";
import { User } from "../app/modules/user/user.model";

type SeedPet = {
  intakeId: string;
  name: string;
  species: "dog" | "cat" | "rabbit" | "bird" | "other";
  breed: string;
  mixedBreed: boolean;
  age: {
    years: number;
    months: number;
  };
  size: "small" | "medium" | "large" | "extra_large";
  gender: "male" | "female" | "unknown";
  color?: string;
  weight?: number;
  temperament: string[];
  description: string;
  photos: {
    url: string;
    publicId: string;
    isPrimary: boolean;
  }[];
  status: "intake" | "medical_hold" | "available" | "adoption_pending" | "adopted" | "foster_placed";
  intakeDate: Date;
  intakeType: "stray" | "surrendered" | "rescued" | "transferred";
  intakeNotes?: string;
  shelter: {
    name: string;
    address: string;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  isNeutered: boolean;
  isMicrochipped: boolean;
};

const shelterA = {
  name: "Main Street Shelter",
  address: "123 Main St, New York, NY",
  location: {
    type: "Point" as const,
    coordinates: [-74.006, 40.7128] as [number, number],
  },
};

const shelterB = {
  name: "Second Chance Shelter",
  address: "456 Oak Ave, Brooklyn, NY",
  location: {
    type: "Point" as const,
    coordinates: [-73.9442, 40.6782] as [number, number],
  },
};

const samplePets: SeedPet[] = [
  {
    intakeId: "PET-2026-1001",
    name: "Luna",
    species: "dog",
    breed: "Golden Retriever",
    mixedBreed: false,
    age: { years: 3, months: 0 },
    size: "large",
    gender: "female",
    color: "Golden",
    weight: 28,
    temperament: ["Gentle", "Playful", "Friendly"],
    description: "Luna is a calm, affectionate dog who loves long walks, gentle play, and curling up next to people.",
    photos: [{ url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200", publicId: "seed-luna", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-01-15"),
    intakeType: "surrendered",
    intakeNotes: "Owner relocated internationally.",
    shelter: shelterA,
    isNeutered: true,
    isMicrochipped: true,
  },
  {
    intakeId: "PET-2026-1002",
    name: "Milo",
    species: "cat",
    breed: "Siamese",
    mixedBreed: false,
    age: { years: 2, months: 4 },
    size: "small",
    gender: "male",
    color: "Cream",
    weight: 4.5,
    temperament: ["Curious", "Affectionate", "Vocal"],
    description: "Milo is a social cat who enjoys attention, perches by sunny windows, and playful toy sessions.",
    photos: [{ url: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=1200", publicId: "seed-milo", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-01-20"),
    intakeType: "stray",
    intakeNotes: "Found near a neighborhood market.",
    shelter: shelterA,
    isNeutered: true,
    isMicrochipped: true,
  },
  {
    intakeId: "PET-2026-1003",
    name: "Charlie",
    species: "dog",
    breed: "Beagle Mix",
    mixedBreed: true,
    age: { years: 1, months: 6 },
    size: "medium",
    gender: "male",
    color: "Brown and White",
    weight: 15,
    temperament: ["Energetic", "Smart", "Friendly"],
    description: "Charlie is a bright young dog who loves sniff walks, learning new routines, and active households.",
    photos: [{ url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=1200", publicId: "seed-charlie", isPrimary: true }],
    status: "adoption_pending",
    intakeDate: new Date("2026-02-10"),
    intakeType: "rescued",
    intakeNotes: "Recovered from a neglect case and now doing well in care.",
    shelter: shelterB,
    isNeutered: true,
    isMicrochipped: false,
  },
  {
    intakeId: "PET-2026-1004",
    name: "Bella",
    species: "dog",
    breed: "Labrador Retriever",
    mixedBreed: false,
    age: { years: 4, months: 0 },
    size: "large",
    gender: "female",
    color: "Black",
    weight: 30,
    temperament: ["Loyal", "Calm", "Patient"],
    description: "Bella is well-mannered, steady around children, and happiest when she can stay close to her people.",
    photos: [{ url: "https://images.unsplash.com/photo-1494947665472-88aa455654c5?w=1200", publicId: "seed-bella", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-01-25"),
    intakeType: "surrendered",
    intakeNotes: "Family allergy change.",
    shelter: shelterA,
    isNeutered: true,
    isMicrochipped: true,
  },
  {
    intakeId: "PET-2026-1005",
    name: "Whiskers",
    species: "cat",
    breed: "Tabby",
    mixedBreed: true,
    age: { years: 5, months: 1 },
    size: "medium",
    gender: "male",
    color: "Orange",
    weight: 5.3,
    temperament: ["Calm", "Independent", "Loving"],
    description: "Whiskers enjoys a quiet home, soft bedding, and affectionate moments when he chooses to seek them out.",
    photos: [{ url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200", publicId: "seed-whiskers", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-02-05"),
    intakeType: "surrendered",
    intakeNotes: "Previous owner moved into assisted living.",
    shelter: shelterA,
    isNeutered: true,
    isMicrochipped: true,
  },
  {
    intakeId: "PET-2026-1006",
    name: "Max",
    species: "dog",
    breed: "German Shepherd",
    mixedBreed: false,
    age: { years: 2, months: 2 },
    size: "large",
    gender: "male",
    color: "Black and Tan",
    weight: 35,
    temperament: ["Active", "Loyal", "Trainable"],
    description: "Max is highly engaged, food motivated, and thrives with structure, exercise, and confident handling.",
    photos: [{ url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=1200", publicId: "seed-max", isPrimary: true }],
    status: "medical_hold",
    intakeDate: new Date("2026-02-15"),
    intakeType: "surrendered",
    intakeNotes: "Awaiting follow-up treatment for a minor leg strain.",
    shelter: shelterB,
    isNeutered: true,
    isMicrochipped: true,
  },
  {
    intakeId: "PET-2026-1007",
    name: "Daisy",
    species: "dog",
    breed: "Cocker Spaniel",
    mixedBreed: false,
    age: { years: 6, months: 0 },
    size: "medium",
    gender: "female",
    color: "Buff",
    weight: 12,
    temperament: ["Sweet", "Quiet", "Gentle"],
    description: "Daisy is a soft-natured companion who enjoys easy walks and cozy indoor routines.",
    photos: [{ url: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1200", publicId: "seed-daisy", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-02-18"),
    intakeType: "transferred",
    intakeNotes: "Transferred from a rural partner shelter.",
    shelter: shelterA,
    isNeutered: true,
    isMicrochipped: false,
  },
  {
    intakeId: "PET-2026-1008",
    name: "Oreo",
    species: "cat",
    breed: "Domestic Shorthair",
    mixedBreed: true,
    age: { years: 1, months: 10 },
    size: "small",
    gender: "female",
    color: "Black and White",
    weight: 3.9,
    temperament: ["Playful", "Alert", "Gentle"],
    description: "Oreo is energetic and curious, with a playful personality and a quick purr when she feels safe.",
    photos: [{ url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200", publicId: "seed-oreo", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-02-20"),
    intakeType: "rescued",
    intakeNotes: "Rescued with a litter and now fully independent.",
    shelter: shelterB,
    isNeutered: true,
    isMicrochipped: true,
  },
  {
    intakeId: "PET-2026-1009",
    name: "Rocky",
    species: "dog",
    breed: "Boxer",
    mixedBreed: false,
    age: { years: 3, months: 7 },
    size: "large",
    gender: "male",
    color: "Fawn",
    weight: 29,
    temperament: ["Goofy", "Friendly", "Athletic"],
    description: "Rocky loves games, training sessions, and people who appreciate a silly, affectionate dog.",
    photos: [{ url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200", publicId: "seed-rocky", isPrimary: true }],
    status: "foster_placed",
    intakeDate: new Date("2026-02-22"),
    intakeType: "surrendered",
    intakeNotes: "Placed in foster to decompress from kennel stress.",
    shelter: shelterB,
    isNeutered: true,
    isMicrochipped: true,
  },
  {
    intakeId: "PET-2026-1010",
    name: "Coco",
    species: "bird",
    breed: "Cockatiel",
    mixedBreed: false,
    age: { years: 2, months: 0 },
    size: "small",
    gender: "unknown",
    color: "Grey and Yellow",
    weight: 0.1,
    temperament: ["Social", "Curious", "Active"],
    description: "Coco is a bright, chatty bird who thrives with daily enrichment and patient handling.",
    photos: [{ url: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1200", publicId: "seed-coco", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-02-25"),
    intakeType: "transferred",
    intakeNotes: "Transferred from an avian rescue partner.",
    shelter: shelterA,
    isNeutered: false,
    isMicrochipped: false,
  },
  {
    intakeId: "PET-2026-1011",
    name: "Hazel",
    species: "rabbit",
    breed: "Mini Lop",
    mixedBreed: false,
    age: { years: 1, months: 3 },
    size: "small",
    gender: "female",
    color: "Brown",
    weight: 2.1,
    temperament: ["Gentle", "Shy", "Sweet"],
    description: "Hazel is a gentle rabbit who needs a calm space, soft bedding, and slow introductions.",
    photos: [{ url: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=1200", publicId: "seed-hazel", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-02-28"),
    intakeType: "surrendered",
    intakeNotes: "Owner could no longer provide indoor housing.",
    shelter: shelterA,
    isNeutered: true,
    isMicrochipped: false,
  },
  {
    intakeId: "PET-2026-1012",
    name: "Bruno",
    species: "dog",
    breed: "Rottweiler Mix",
    mixedBreed: true,
    age: { years: 5, months: 5 },
    size: "large",
    gender: "male",
    color: "Black and Rust",
    weight: 38,
    temperament: ["Protective", "Calm", "Loyal"],
    description: "Bruno is affectionate with trusted people and does best in a calm, adult home with clear boundaries.",
    photos: [{ url: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=1200", publicId: "seed-bruno", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-03-01"),
    intakeType: "rescued",
    intakeNotes: "Recovered from a cruelty investigation and progressing well.",
    shelter: shelterB,
    isNeutered: true,
    isMicrochipped: true,
  },
  {
    intakeId: "PET-2026-1013",
    name: "Nala",
    species: "cat",
    breed: "Maine Coon Mix",
    mixedBreed: true,
    age: { years: 4, months: 2 },
    size: "medium",
    gender: "female",
    color: "Brown Tabby",
    weight: 5.9,
    temperament: ["Affectionate", "Easygoing", "Observant"],
    description: "Nala is confident and mellow, with a steady personality that fits many home routines.",
    photos: [{ url: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=1200", publicId: "seed-nala", isPrimary: true }],
    status: "adopted",
    intakeDate: new Date("2026-01-10"),
    intakeType: "stray",
    intakeNotes: "Adoption finalized after an extended meet-and-greet period.",
    shelter: shelterA,
    isNeutered: true,
    isMicrochipped: true,
  },
  {
    intakeId: "PET-2026-1014",
    name: "Pepper",
    species: "dog",
    breed: "Australian Cattle Dog",
    mixedBreed: false,
    age: { years: 2, months: 8 },
    size: "medium",
    gender: "female",
    color: "Blue Merle",
    weight: 18,
    temperament: ["Driven", "Bright", "Active"],
    description: "Pepper is a high-energy herding dog who needs a home that enjoys training, movement, and engagement.",
    photos: [{ url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200", publicId: "seed-pepper", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-03-03"),
    intakeType: "surrendered",
    intakeNotes: "Owner was not prepared for working-breed needs.",
    shelter: shelterB,
    isNeutered: true,
    isMicrochipped: true,
  },
  {
    intakeId: "PET-2026-1015",
    name: "Simba",
    species: "cat",
    breed: "Domestic Longhair",
    mixedBreed: true,
    age: { years: 3, months: 6 },
    size: "medium",
    gender: "male",
    color: "Ginger",
    weight: 5.1,
    temperament: ["Confident", "Friendly", "Curious"],
    description: "Simba is outgoing and affectionate, often greeting visitors and exploring every corner of the room.",
    photos: [{ url: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=1200", publicId: "seed-simba", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-03-04"),
    intakeType: "rescued",
    intakeNotes: "Recovered from an overcrowded property.",
    shelter: shelterA,
    isNeutered: true,
    isMicrochipped: false,
  },
  {
    intakeId: "PET-2026-1016",
    name: "Maple",
    species: "rabbit",
    breed: "Lionhead Mix",
    mixedBreed: true,
    age: { years: 2, months: 1 },
    size: "small",
    gender: "female",
    color: "Cream",
    weight: 1.8,
    temperament: ["Gentle", "Watchful", "Quiet"],
    description: "Maple enjoys spacious enclosures, hay-based enrichment, and a slow, predictable environment.",
    photos: [{ url: "https://images.unsplash.com/photo-1583301286816-f4f05e1e8b25?w=1200", publicId: "seed-maple", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-03-05"),
    intakeType: "transferred",
    intakeNotes: "Transferred from a small animal rescue partner.",
    shelter: shelterB,
    isNeutered: true,
    isMicrochipped: false,
  },
  {
    intakeId: "PET-2026-1017",
    name: "Scout",
    species: "dog",
    breed: "Border Collie Mix",
    mixedBreed: true,
    age: { years: 1, months: 11 },
    size: "medium",
    gender: "male",
    color: "Black and White",
    weight: 19,
    temperament: ["Focused", "Athletic", "Alert"],
    description: "Scout is quick to learn and would love an adopter interested in training and enrichment.",
    photos: [{ url: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=1200", publicId: "seed-scout", isPrimary: true }],
    status: "intake",
    intakeDate: new Date("2026-03-08"),
    intakeType: "stray",
    intakeNotes: "Recently arrived and completing intake evaluation.",
    shelter: shelterA,
    isNeutered: false,
    isMicrochipped: false,
  },
  {
    intakeId: "PET-2026-1018",
    name: "Poppy",
    species: "dog",
    breed: "Shih Tzu",
    mixedBreed: false,
    age: { years: 7, months: 0 },
    size: "small",
    gender: "female",
    color: "White and Tan",
    weight: 7.2,
    temperament: ["Cuddly", "Calm", "Sociable"],
    description: "Poppy is a sweet senior small dog who appreciates laps, short walks, and predictable routines.",
    photos: [{ url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200", publicId: "seed-poppy", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-03-10"),
    intakeType: "surrendered",
    intakeNotes: "Owner health issues made ongoing care difficult.",
    shelter: shelterB,
    isNeutered: true,
    isMicrochipped: true,
  },
  {
    intakeId: "PET-2026-1019",
    name: "Kiwi",
    species: "bird",
    breed: "Budgerigar",
    mixedBreed: false,
    age: { years: 1, months: 2 },
    size: "small",
    gender: "unknown",
    color: "Green and Yellow",
    weight: 0.05,
    temperament: ["Bright", "Quick", "Social"],
    description: "Kiwi is an active little bird who benefits from enrichment, gentle socialization, and routine care.",
    photos: [{ url: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=1200", publicId: "seed-kiwi", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-03-11"),
    intakeType: "rescued",
    intakeNotes: "Recovered from an abandoned cage setup.",
    shelter: shelterA,
    isNeutered: false,
    isMicrochipped: false,
  },
  {
    intakeId: "PET-2026-1020",
    name: "Shadow",
    species: "dog",
    breed: "Great Dane Mix",
    mixedBreed: true,
    age: { years: 4, months: 4 },
    size: "extra_large",
    gender: "male",
    color: "Slate Grey",
    weight: 49,
    temperament: ["Gentle", "Slow-paced", "Affectionate"],
    description: "Shadow is a giant sweetheart who wants a roomy home, soft bedding, and a calm adopter.",
    photos: [{ url: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1200", publicId: "seed-shadow", isPrimary: true }],
    status: "available",
    intakeDate: new Date("2026-03-12"),
    intakeType: "transferred",
    intakeNotes: "Transferred for breed-specific placement support.",
    shelter: shelterB,
    isNeutered: true,
    isMicrochipped: true,
  },
];

const ensureStaffUser = async () => {
  const existingStaff = await User.findOne({ role: { $in: ["Admin", "Staff"] } });

  if (existingStaff) {
    return existingStaff;
  }

  const hashedPassword = await bcrypt.hash("password", 12);

  return User.create({
    name: "Staff User",
    email: "staff@petadopt.com",
    password: hashedPassword,
    role: "Staff",
    isVerified: true,
    isFosterApproved: true,
  });
};

const seedPets = async () => {
  try {
    await connectDB();

    const staffUser = await ensureStaffUser();
    let createdCount = 0;
    let updatedCount = 0;

    for (const pet of samplePets) {
      const existingPet = await Pet.findOne({ intakeId: pet.intakeId });

      if (existingPet) {
        await Pet.updateOne(
          { intakeId: pet.intakeId },
          {
            $set: {
              ...pet,
              createdBy: staffUser._id,
            },
          }
        );
        updatedCount += 1;
      } else {
        await Pet.create({
          ...pet,
          createdBy: staffUser._id,
        });
        createdCount += 1;
      }
    }

    console.log(`Seeded pets successfully. Created: ${createdCount}, Updated: ${updatedCount}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding pets:", error);
    process.exit(1);
  }
};

void seedPets();
