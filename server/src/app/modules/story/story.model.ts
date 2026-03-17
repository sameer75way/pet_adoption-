import { Schema, model, Types } from "mongoose";

export interface IStory {
  title: string;
  summary: string;
  content: string;
  image: string;
  petName?: string;
  adopterName?: string;
  published: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    petName: {
      type: String,
      trim: true
    },
    adopterName: {
      type: String,
      trim: true
    },
    published: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Story = model<IStory>("Story", storySchema);
