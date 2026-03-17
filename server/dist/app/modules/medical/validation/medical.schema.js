"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedicalRecordSchema = void 0;
const zod_1 = require("zod");
exports.createMedicalRecordSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum([
            "vaccination",
            "deworming",
            "surgery",
            "vet_visit",
            "diagnosis",
            "prescription"
        ]),
        title: zod_1.z.string(),
        date: zod_1.z.string(),
        vetName: zod_1.z.string().optional(),
        vetClinic: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional()
    })
});
//# sourceMappingURL=medical.schema.js.map