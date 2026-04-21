import { z } from "zod";

export const createMedicalRecordSchema = z.object({
  body: z.object({
    type: z.enum([
      "vaccination",
      "deworming",
      "surgery",
      "vet_visit",
      "diagnosis",
      "prescription",
    ]),
    title: z.string().min(1),
    notes: z.string().optional(),
    date: z.string().min(1),
    vetName: z.string().optional(),
    vetClinic: z.string().optional(),
  }),
});

