"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const mongoose_1 = require("mongoose");
const applicationSchema = new mongoose_1.Schema({
    pet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    applicant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: [
            "submitted",
            "under_review",
            "approved",
            "rejected",
            "withdrawn"
        ],
        default: "submitted"
    },
    questionnaire: {
        housingType: String,
        hasYard: Boolean,
        householdAdults: Number,
        householdChildren: Number,
        otherPets: String,
        previousPets: String,
        hoursAlonePerDay: Number,
        reasonForAdoption: String
    },
    rejectionReason: String
}, { timestamps: true });
exports.Application = (0, mongoose_1.model)("Application", applicationSchema);
//# sourceMappingURL=application.model.js.map