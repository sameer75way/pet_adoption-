import { Schema, model, Types } from "mongoose";

/**
 * Pet Status Lifecycle
 */
export type PetStatus =
  | "intake"
  | "medical_hold"
  | "available"
  | "adoption_pending"
  | "adopted"
  | "foster_placed";

/**
 * Pet Interface
 */
export interface IPet {
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

  status: PetStatus;

  intakeDate: Date;
  intakeType: "stray" | "surrendered" | "rescued" | "transferred";
  intakeNotes?: string;

  shelter: {
    name: string;
    address: string;
    location: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };
  };

  isNeutered: boolean;
  isMicrochipped: boolean;

  adoptedBy?: Types.ObjectId;
  adoptedAt?: Date;

  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Pet Schema
 */
const petSchema = new Schema<IPet>(
  {
    intakeId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    species: {
      type: String,
      enum: ["dog", "cat", "rabbit", "bird", "other"],
      required: true
    },

    breed: {
      type: String,
      required: true
    },

    mixedBreed: {
      type: Boolean,
      default: false
    },

    age: {
      years: { type: Number, required: true },
      months: { type: Number, required: true }
    },

    size: {
      type: String,
      enum: ["small", "medium", "large", "extra_large"],
      required: true
    },

    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      required: true
    },

    color: String,

    weight: Number,

    temperament: {
      type: [String],
      default: []
    },

    description: {
      type: String,
      required: true
    },

    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isPrimary: { type: Boolean, default: false }
      }
    ],

    status: {
      type: String,
      enum: [
        "intake",
        "medical_hold",
        "available",
        "adoption_pending",
        "adopted",
        "foster_placed"
      ],
      default: "intake"
    },

    intakeDate: {
      type: Date,
      default: Date.now
    },

    intakeType: {
      type: String,
      enum: ["stray", "surrendered", "rescued", "transferred"],
      required: true
    },

    intakeNotes: String,

    shelter: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point"
        },
        coordinates: {
          type: [Number], // [lng, lat]
          required: true
        }
      }
    },

    isNeutered: {
      type: Boolean,
      default: false
    },

    isMicrochipped: {
      type: Boolean,
      default: false
    },

    adoptedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    adoptedAt: Date,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

/**
 * Indexes
 */

// Geo search index
petSchema.index({ "shelter.location": "2dsphere" });

// Search indexes
petSchema.index({ species: 1 });
petSchema.index({ breed: 1 });
petSchema.index({ size: 1 });
petSchema.index({ status: 1 });

/**
 * Model Export
 */
export const Pet = model<IPet>("Pet", petSchema);