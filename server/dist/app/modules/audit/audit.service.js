"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = void 0;
const audit_model_1 = require("./audit.model");
const logAudit = async (actor, action, resourceId) => {
    await audit_model_1.Audit.create({
        actor,
        action,
        resourceId
    });
};
exports.logAudit = logAudit;
//# sourceMappingURL=audit.service.js.map