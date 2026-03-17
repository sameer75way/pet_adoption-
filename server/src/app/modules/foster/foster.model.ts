import { Schema, model, Types } from "mongoose";

export interface IFosterAssignment {
  pet: Types.ObjectId;
  fosterParent: Types.ObjectId;
  status: "active" | "completed" | "returned_early";
  startDate: Date;
  expectedEndDate: Date;
  actualEndDate?: Date;
  notes?: string;
  assignedBy: Types.ObjectId;
}

const fosterAssignmentSchema = new Schema<IFosterAssignment>(
  {
    pet: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true
    },
    fosterParent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["active", "completed", "returned_early"],
      default: "active"
    },
    startDate: {
      type: Date,
      required: true
    },
    expectedEndDate: {
      type: Date,
      required: true
    },
    actualEndDate: Date,
    notes: String,
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const FosterAssignment = model<IFosterAssignment>(
  "FosterAssignment",
  fosterAssignmentSchema
);