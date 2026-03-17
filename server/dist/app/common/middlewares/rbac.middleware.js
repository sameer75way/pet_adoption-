"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!roles.includes(user.role)) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=rbac.middleware.js.map