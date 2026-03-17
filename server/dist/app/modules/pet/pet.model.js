"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pet = void 0;
const mongoose_1 = require("mongoose");
/**
 * Pet Schema
 */
const petSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    adoptedAt: Date,
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
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
exports.Pet = (0, mongoose_1.model)("Pet", petSchema);
//# sourceMappingURL=pet.model.js.map