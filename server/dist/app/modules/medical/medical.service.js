"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedicalSummary = exports.getMedicalHistory = exports.addMedicalRecord = exports.getAllMedicalRecords = void 0;
const medical_model_1 = require("./medical.model");
const getAllMedicalRecords = async () => {
    return medical_model_1.MedicalRecord.find()
        .populate("pet")
        .populate("recordedBy")
        .sort({ date: -1, createdAt: -1 });
};
exports.getAllMedicalRecords = getAllMedicalRecords;
const addMedicalRecord = async (petId, data, userId) => {
    const record = await medical_model_1.MedicalRecord.create({
        ...data,
        pet: petId,
        recordedBy: userId
    });
    return record;
};
exports.addMedicalRecord = addMedicalRecord;
const getMedicalHistory = async (petId) => {
    return medical_model_1.MedicalRecord.find({ pet: petId })
        .sort({ date: -1 });
};
exports.getMedicalHistory = getMedicalHistory;
const getMedicalSummary = async (petId) => {
    const records = await medical_model_1.MedicalRecord.find({
        pet: petId,
        type: "vaccination"
    });
    return {
        vaccinated: records.length > 0
    };
};
exports.getMedicalSummary = getMedicalSummary;
//# sourceMappingURL=medical.service.js.map