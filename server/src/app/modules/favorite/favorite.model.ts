import { Schema, model, Types } from "mongoose";

export interface IFavorite {

  user: Types.ObjectId;
  pet: Types.ObjectId;

}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    pet: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true
    }
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, pet: 1 }, { unique: true });

export const Favorite = model<IFavorite>(
  "Favorite",
  favoriteSchema
);