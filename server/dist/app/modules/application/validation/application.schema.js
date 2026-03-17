"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
exports.createApplicationSchema = zod_1.z.object({
    body: zod_1.z.object({
        pet: zod_1.z.string(),
        questionnaire: zod_1.z.object({
            housingType: zod_1.z.string(),
            hasYard: zod_1.z.boolean(),
            householdAdults: zod_1.z.number(),
            householdChildren: zod_1.z.number(),
            otherPets: zod_1.z.string(),
            previousPets: zod_1.z.string(),
            hoursAlonePerDay: zod_1.z.number(),
            reasonForAdoption: zod_1.z.string()
        })
    })
});
//# sourceMappingURL=application.schema.js.map