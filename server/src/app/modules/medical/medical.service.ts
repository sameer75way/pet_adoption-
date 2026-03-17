import { MedicalRecord } from "./medical.model";

export const getAllMedicalRecords = async () => {
  return MedicalRecord.find()
    .populate("pet")
    .populate("recordedBy")
    .sort({ date: -1, createdAt: -1 });
};

export const addMedicalRecord = async (
  petId: string,
  data: any,
  userId: string
) => {

  const record = await MedicalRecord.create({
    ...data,
    pet: petId,
    recordedBy: userId
  });

  return record;

};

export const getMedicalHistory = async (petId: string) => {

  return MedicalRecord.find({ pet: petId })
    .sort({ date: -1 });

};

export const getMedicalSummary = async (petId: string) => {

  const records = await MedicalRecord.find({
    pet: petId,
    type: "vaccination"
  });

  return {
    vaccinated: records.length > 0
  };

};
