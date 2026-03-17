import { Request, Response } from "express";
import * as favoriteService from "./favorite.service";

export const toggleFavoriteController = async (
  req: Request,
  res: Response
) => {

  const user = (req as any).user;

  const result = await favoriteService.toggleFavorite(
    user.id,
    req.params.petId as string
  );

  res.json({
    success: true,
    data: result
  });

};

export const getFavoritesController = async (
  req: Request,
  res: Response
) => {

  const user = (req as any).user;

  const favorites =
    await favoriteService.getFavorites(user.id);

  res.json({
    success: true,
    data: favorites
  });

};
