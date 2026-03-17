import { Favorite } from "./favorite.model";

export const toggleFavorite = async (
  userId: string,
  petId: string
) => {

  const existing = await Favorite.findOne({
    user: userId,
    pet: petId
  });

  if (existing) {

    await existing.deleteOne();

    return { favorited: false };

  }

  await Favorite.create({
    user: userId,
    pet: petId
  });

  return { favorited: true };

};

export const getFavorites = async (userId: string) => {

  return Favorite.find({ user: userId }).populate("pet");

};