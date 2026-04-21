import { z } from "zod";

export const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1),
    previousResponseId: z.string().optional(),
  }),
});

