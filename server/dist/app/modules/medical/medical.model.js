"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecord = void 0;
const mongoose_1 = require("mongoose");
const medicalSchema = new mongoose_1.Schema({
    pet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    type: {
        type: String,
        enum: [
            "vaccination",
            "deworming",
            "surgery",
            "vet_visit",
            "diagnosis",
            "prescription"
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    notes: String,
    date: {
        type: Date,
        required: true
    },
    vetName: String,
    vetClinic: String,
    recordedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
exports.MedicalRecord = (0, mongoose_1.model)("MedicalRecord", medicalSchema);
//# sourceMappingURL=medical.model.js.map