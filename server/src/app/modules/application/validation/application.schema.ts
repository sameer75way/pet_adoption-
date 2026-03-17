import { z } from "zod";

export const createApplicationSchema = z.object({

  body: z.object({

    pet: z.string(),

    questionnaire: z.object({

      housingType: z.string(),

      hasYard: z.boolean(),

      householdAdults: z.number(),

      householdChildren: z.number(),

      otherPets: z.string(),

      previousPets: z.string(),

      hoursAlonePerDay: z.number(),

      reasonForAdoption: z.string()

    })

  })

});