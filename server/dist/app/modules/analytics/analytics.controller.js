"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overviewController = void 0;
const analytics_service_1 = require("./analytics.service");
const overviewController = async (req, res) => {
    const data = await (0, analytics_service_1.getOverview)();
    res.json(data);
};
exports.overviewController = overviewController;
//# sourceMappingURL=analytics.controller.js.map