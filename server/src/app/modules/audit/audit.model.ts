import { Schema, model, Types } from "mongoose";

export interface IAudit {

  actor: Types.ObjectId;

  action: string;

  resourceId: Types.ObjectId;

}

const auditSchema = new Schema<IAudit>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    action: String,

    resourceId: Schema.Types.ObjectId
  },
  { timestamps: true }
);

export const Audit = model<IAudit>(
  "Audit",
  auditSchema
);