"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audit = void 0;
const mongoose_1 = require("mongoose");
const auditSchema = new mongoose_1.Schema({
    actor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    action: String,
    resourceId: mongoose_1.Schema.Types.ObjectId
}, { timestamps: true });
exports.Audit = (0, mongoose_1.model)("Audit", auditSchema);
//# sourceMappingURL=audit.model.js.map