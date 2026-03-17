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
exports.getMedicalSummaryController = exports.getMedicalHistoryController = exports.getAllMedicalRecordsController = exports.addMedicalRecordController = void 0;
const medicalService = __importStar(require("./medical.service"));
const addMedicalRecordController = async (req, res) => {
    const user = req.user;
    const record = await medicalService.addMedicalRecord(req.params.petId, req.body, user.id);
    res.status(201).json({
        success: true,
        data: record
    });
};
exports.addMedicalRecordController = addMedicalRecordController;
const getAllMedicalRecordsController = async (req, res) => {
    const records = await medicalService.getAllMedicalRecords();
    res.json({
        success: true,
        data: records
    });
};
exports.getAllMedicalRecordsController = getAllMedicalRecordsController;
const getMedicalHistoryController = async (req, res) => {
    const history = await medicalService.getMedicalHistory(req.params.petId);
    res.json({
        success: true,
        data: history
    });
};
exports.getMedicalHistoryController = getMedicalHistoryController;
const getMedicalSummaryController = async (req, res) => {
    const summary = await medicalService.getMedicalSummary(req.params.petId);
    res.json({
        success: true,
        data: summary
    });
};
exports.getMedicalSummaryController = getMedicalSummaryController;
//# sourceMappingURL=medical.controller.js.map