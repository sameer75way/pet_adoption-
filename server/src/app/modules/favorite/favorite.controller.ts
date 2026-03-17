import { Request, Response } from "express";
import * as favoriteService from "./favorite.service";
import { emitToUser } from "../message/socket";

export const toggleFavoriteController = async (
  req: Request,
  res: Response
) => {

  const user = (req as any).user;

  const result = await favoriteService.toggleFavorite(
    user.id,
    req.params.petId as string
  );

  emitToUser(user.id, "favorite:updated", {
    petId: req.params.petId as string,
    ...result
  });

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
