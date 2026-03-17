import { Schema, model, Types } from "mongoose";

export type MedicalRecordType =
  | "vaccination"
  | "deworming"
  | "surgery"
  | "vet_visit"
  | "diagnosis"
  | "prescription";

export interface IMedicalRecord {

  pet: Types.ObjectId;

  type: MedicalRecordType;

  title: string;

  notes: string;

  date: Date;

  vetName: string;

  vetClinic: string;

  recordedBy: Types.ObjectId;

}

const medicalSchema = new Schema<IMedicalRecord>(
  {

    pet: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true
    },

    type: {
      type: String,
      enum: [
        "vaccination",
        "deworming",
        "surgery",
        "vet_visit",
        "diagnosis",
        "prescription"
      ],
      required: true
    },

    title: {
      type: String,
      required: true
    },

    notes: String,

    date: {
      type: Date,
      required: true
    },

    vetName: String,

    vetClinic: String,

    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }

  },

  { timestamps: true }

);

export const MedicalRecord = model<IMedicalRecord>(
  "MedicalRecord",
  medicalSchema
);