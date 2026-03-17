import { z } from "zod";

export const createPetSchema = z.object({

  body: z.object({

    name: z.string(),

    species: z.enum([
      "dog",
      "cat",
      "rabbit",
      "bird",
      "other"
    ]),

    breed: z.string(),

    size: z.enum([
      "small",
      "medium",
      "large",
      "extra_large"
    ]),

    gender: z.enum([
      "male",
      "female",
      "unknown"
    ]),

    mixedBreed: z.boolean().optional(),
    age: z.object({
      years: z.number().min(0),
      months: z.number().min(0).max(11)
    }),
    color: z.string().optional(),
    weight: z.number().optional(),
    temperament: z.array(z.string()).optional(),
    description: z.string().min(10),
    photos: z.array(
      z.object({
        url: z.string().url(),
        publicId: z.string(),
        isPrimary: z.boolean()
      })
    ).optional(),
    status: z.enum([
      "intake",
      "medical_hold",
      "available",
      "adoption_pending",
      "adopted",
      "foster_placed"
    ]).optional(),
    intakeDate: z.string().optional(),
    intakeType: z.enum([
      "stray",
      "surrendered",
      "rescued",
      "transferred"
    ]),
    intakeNotes: z.string().optional(),
    shelter: z.object({
      name: z.string(),
      address: z.string(),
      location: z.object({
        type: z.literal("Point").optional(),
        coordinates: z.tuple([z.number(), z.number()])
      })
    }),
    isNeutered: z.boolean().optional(),
    isMicrochipped: z.boolean().optional()

  })

});
