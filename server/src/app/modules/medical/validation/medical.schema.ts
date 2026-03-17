import { z } from "zod";

export const createMedicalRecordSchema = z.object({

  body: z.object({

    type: z.enum([
      "vaccination",
      "deworming",
      "surgery",
      "vet_visit",
      "diagnosis",
      "prescription"
    ]),

    title: z.string(),

    date: z.string(),

    vetName: z.string().optional(),

    vetClinic: z.string().optional(),

    notes: z.string().optional()

  })

});