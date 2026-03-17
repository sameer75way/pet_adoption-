"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatusController = exports.getApplicationsController = exports.getMyApplicationsController = exports.submitApplicationController = void 0;
const applicationService = __importStar(require("./application.service"));
const submitApplicationController = async (req, res) => {
    const user = req.user;
    const application = await applicationService.submitApplication(req.body, user.id);
    res.status(201).json({
        success: true,
        data: application
    });
};
exports.submitApplicationController = submitApplicationController;
const getMyApplicationsController = async (req, res) => {
    const user = req.user;
    const apps = await applicationService.getMyApplications(user.id);
    res.json({
        success: true,
        data: apps
    });
};
exports.getMyApplicationsController = getMyApplicationsController;
const getApplicationsController = async (req, res) => {
    const apps = await applicationService.getApplications(req.query);
    res.json({
        success: true,
        ...apps
    });
};
exports.getApplicationsController = getApplicationsController;
const updateApplicationStatusController = async (req, res) => {
    const { status, reason, rejectionReason } = req.body;
    const app = await applicationService.updateApplicationStatus(req.params.id, status, rejectionReason || reason);
    res.json({
        success: true,
        data: app
    });
};
exports.updateApplicationStatusController = updateApplicationStatusController;
//# sourceMappingURL=application.controller.js.map