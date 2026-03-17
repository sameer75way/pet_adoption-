export type PetStatus =
  | "intake"
  | "medical_hold"
  | "available"
  | "adoption_pending"
  | "adopted"
  | "foster_placed";

export type PetSpecies = "dog" | "cat" | "rabbit" | "bird" | "other";
export type PetSize = "small" | "medium" | "large" | "extra_large";
export type PetGender = "male" | "female" | "unknown";
export type IntakeType = "stray" | "surrendered" | "rescued" | "transferred";

export interface PetPhoto {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface Pet {
  _id: string;
  intakeId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  mixedBreed: boolean;
  age: {
    years: number;
    months: number;
  };
  size: PetSize;
  gender: PetGender;
  color?: string;
  weight?: number;
  temperament: string[];
  description: string;
  photos: PetPhoto[];
  status: PetStatus;
  intakeDate: string;
  intakeType: IntakeType;
  intakeNotes?: string;
  shelter: {
    name: string;
    address: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
  };
  isNeutered: boolean;
  isMicrochipped: boolean;
  adoptedBy?: string;
  adoptedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const samplePets: Pet[] = [
  {
    _id: "1",
    intakeId: "PET001",
    name: "Luna",
    species: "dog",
    breed: "Golden Retriever",
    mixedBreed: false,
    age: { years: 3, months: 0 },
    size: "large",
    gender: "female",
    color: "Golden",
    weight: 28,
    temperament: ["Friendly", "Gentle", "Playful"],
    description: "Luna is a sweet and gentle Golden Retriever who loves to play fetch and cuddle. She's great with kids and other pets. She's been with us for 2 months and is looking for her forever home.",
    photos: [
      { url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800", publicId: "luna1", isPrimary: true }
    ],
    status: "available",
    intakeDate: "2026-01-15",
    intakeType: "surrendered",
    intakeNotes: "Previous owner moved overseas",
    shelter: {
      name: "Main Street Shelter",
      address: "123 Main St",
      location: { type: "Point", coordinates: [-74.006, 40.7128] }
    },
    isNeutered: true,
    isMicrochipped: true,
    createdBy: "staff1",
    createdAt: "2026-01-15",
    updatedAt: "2026-01-15"
  },
  {
    _id: "2",
    intakeId: "PET002",
    name: "Milo",
    species: "cat",
    breed: "Siamese",
    mixedBreed: false,
    age: { years: 2, months: 3 },
    size: "small",
    gender: "male",
    color: "Cream",
    weight: 4.5,
    temperament: ["Affectionate", "Vocal", "Curious"],
    description: "Milo is a beautiful Siamese cat who loves to chat with his humans. He's very affectionate and enjoys being the center of attention. He would do best in a quiet home without other pets.",
    photos: [
      { url: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800", publicId: "milo1", isPrimary: true }
    ],
    status: "available",
    intakeDate: "2026-02-01",
    intakeType: "stray",
    intakeNotes: "Found wandering near the park",
    shelter: {
      name: "Main Street Shelter",
      address: "123 Main St",
      location: { type: "Point", coordinates: [-74.006, 40.7128] }
    },
    isNeutered: true,
    isMicrochipped: true,
    createdBy: "staff1",
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01"
  },
  {
    _id: "3",
    intakeId: "PET003",
    name: "Charlie",
    species: "dog",
    breed: "Beagle Mix",
    mixedBreed: true,
    age: { years: 1, months: 6 },
    size: "medium",
    gender: "male",
    color: "Brown & White",
    weight: 15,
    temperament: ["Energetic", "Friendly", "Smart"],
    description: "Charlie is a playful Beagle mix with endless energy. He loves going on walks and sniffing around the yard. He's still learning his manners but is very eager to please.",
    photos: [
      { url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800", publicId: "charlie1", isPrimary: true }
    ],
    status: "available",
    intakeDate: "2026-02-10",
    intakeType: "rescued",
    intakeNotes: "Rescued from a neglectful situation",
    shelter: {
      name: "Second Chance Shelter",
      address: "456 Oak Ave",
      location: { type: "Point", coordinates: [-74.015, 40.7208] }
    },
    isNeutered: true,
    isMicrochipped: false,
    createdBy: "staff2",
    createdAt: "2026-02-10",
    updatedAt: "2026-02-10"
  },
  {
    _id: "4",
    intakeId: "PET004",
    name: "Bella",
    species: "dog",
    breed: "Labrador Retriever",
    mixedBreed: false,
    age: { years: 4, months: 0 },
    size: "large",
    gender: "female",
    color: "Black",
    weight: 30,
    temperament: ["Calm", "Loyal", "Protective"],
    description: "Bella is a wonderful companion who loves nothing more than spending time with her people. She's well-trained, housebroken, and ready to be someone's best friend.",
    photos: [
      { url: "https://images.unsplash.com/photo-1494947665472-88aa455654c5?w=800", publicId: "bella1", isPrimary: true }
    ],
    status: "available",
    intakeDate: "2026-01-20",
    intakeType: "surrendered",
    intakeNotes: "Family allergies",
    shelter: {
      name: "Main Street Shelter",
      address: "123 Main St",
      location: { type: "Point", coordinates: [-74.006, 40.7128] }
    },
    isNeutered: true,
    isMicrochipped: true,
    createdBy: "staff1",
    createdAt: "2026-01-20",
    updatedAt: "2026-01-20"
  },
  {
    _id: "5",
    intakeId: "PET005",
    name: "Whiskers",
    species: "cat",
    breed: "Tabby",
    mixedBreed: true,
    age: { years: 5, months: 0 },
    size: "medium",
    gender: "male",
    color: "Orange",
    weight: 5.5,
    temperament: ["Independent", "Calm", "Loving"],
    description: "Whiskers is a laid-back gentleman who enjoys sunny windowsills and afternoon naps. He's independent but loves attention when he asks for it. Perfect for a quiet household.",
    photos: [
      { url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800", publicId: "whiskers1", isPrimary: true }
    ],
    status: "available",
    intakeDate: "2026-02-05",
    intakeType: "surrendered",
    intakeNotes: "Owner moved to assisted living",
    shelter: {
      name: "Main Street Shelter",
      address: "123 Main St",
      location: { type: "Point", coordinates: [-74.006, 40.7128] }
    },
    isNeutered: true,
    isMicrochipped: true,
    createdBy: "staff1",
    createdAt: "2026-02-05",
    updatedAt: "2026-02-05"
  },
  {
    _id: "6",
    intakeId: "PET006",
    name: "Max",
    species: "dog",
    breed: "German Shepherd",
    mixedBreed: false,
    age: { years: 2, months: 0 },
    size: "large",
    gender: "male",
    color: "Black & Tan",
    weight: 35,
    temperament: ["Loyal", "Smart", "Active"],
    description: "Max is a brilliant German Shepherd who needs an experienced owner. He loves training sessions, agility courses, and having a job to do. He bonds deeply with his family.",
    photos: [
      { url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800", publicId: "max1", isPrimary: true }
    ],
    status: "available",
    intakeDate: "2026-02-15",
    intakeType: "surrendered",
    intakeNotes: "Previous owner could not handle energy level",
    shelter: {
      name: "Second Chance Shelter",
      address: "456 Oak Ave",
      location: { type: "Point", coordinates: [-74.015, 40.7208] }
    },
    isNeutered: true,
    isMicrochipped: true,
    createdBy: "staff2",
    createdAt: "2026-02-15",
    updatedAt: "2026-02-15"
  }
];
