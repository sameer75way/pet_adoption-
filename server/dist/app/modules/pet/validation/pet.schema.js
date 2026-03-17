"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPetSchema = void 0;
const zod_1 = require("zod");
exports.createPetSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        species: zod_1.z.enum([
            "dog",
            "cat",
            "rabbit",
            "bird",
            "other"
        ]),
        breed: zod_1.z.string(),
        size: zod_1.z.enum([
            "small",
            "medium",
            "large",
            "extra_large"
        ]),
        gender: zod_1.z.enum([
            "male",
            "female",
            "unknown"
        ]),
        mixedBreed: zod_1.z.boolean().optional(),
        age: zod_1.z.object({
            years: zod_1.z.number().min(0),
            months: zod_1.z.number().min(0).max(11)
        }),
        color: zod_1.z.string().optional(),
        weight: zod_1.z.number().optional(),
        temperament: zod_1.z.array(zod_1.z.string()).optional(),
        description: zod_1.z.string().min(10),
        photos: zod_1.z.array(zod_1.z.object({
            url: zod_1.z.string().url(),
            publicId: zod_1.z.string(),
            isPrimary: zod_1.z.boolean()
        })).optional(),
        status: zod_1.z.enum([
            "intake",
            "medical_hold",
            "available",
            "adoption_pending",
            "adopted",
            "foster_placed"
        ]).optional(),
        intakeDate: zod_1.z.string().optional(),
        intakeType: zod_1.z.enum([
            "stray",
            "surrendered",
            "rescued",
            "transferred"
        ]),
        intakeNotes: zod_1.z.string().optional(),
        shelter: zod_1.z.object({
            name: zod_1.z.string(),
            address: zod_1.z.string(),
            location: zod_1.z.object({
                type: zod_1.z.literal("Point").optional(),
                coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()])
            })
        }),
        isNeutered: zod_1.z.boolean().optional(),
        isMicrochipped: zod_1.z.boolean().optional()
    })
});
//# sourceMappingURL=pet.schema.js.map