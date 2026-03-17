import { Schema, model, Types } from "mongoose";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "withdrawn";

export interface IApplication {

  pet: Types.ObjectId;

  applicant: Types.ObjectId;

  status: ApplicationStatus;

  questionnaire: {
    housingType: string;
    hasYard: boolean;
    householdAdults: number;
    householdChildren: number;
    otherPets: string;
    previousPets: string;
    hoursAlonePerDay: number;
    reasonForAdoption: string;
  };

  rejectionReason?: string;

}

const applicationSchema = new Schema<IApplication>(
  {

    pet: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true
    },

    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "withdrawn"
      ],
      default: "submitted"
    },

    questionnaire: {

      housingType: String,

      hasYard: Boolean,

      householdAdults: Number,

      householdChildren: Number,

      otherPets: String,

      previousPets: String,

      hoursAlonePerDay: Number,

      reasonForAdoption: String

    },

    rejectionReason: String

  },

  { timestamps: true }

);

export const Application = model<IApplication>(
  "Application",
  applicationSchema
);