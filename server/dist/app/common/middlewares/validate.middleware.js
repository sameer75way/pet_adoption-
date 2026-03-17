"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors
            });
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map