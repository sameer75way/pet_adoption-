import { Request, Response } from "express";
import { getOverview } from "./analytics.service";

export const overviewController = async (
  req: Request,
  res: Response
) => {

  const data = await getOverview();

  res.json(data);

};