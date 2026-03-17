"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FosterAssignment = void 0;
const mongoose_1 = require("mongoose");
const fosterAssignmentSchema = new mongoose_1.Schema({
    pet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    fosterParent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["active", "completed", "returned_early"],
        default: "active"
    },
    startDate: {
        type: Date,
        required: true
    },
    expectedEndDate: {
        type: Date,
        required: true
    },
    actualEndDate: Date,
    notes: String,
    assignedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
exports.FosterAssignment = (0, mongoose_1.model)("FosterAssignment", fosterAssignmentSchema);
//# sourceMappingURL=foster.model.js.map