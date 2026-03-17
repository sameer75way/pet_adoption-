import { Request, Response } from "express";
import * as fosterService from "./foster.service";

export const registerFosterController = async (
  req: Request,
  res: Response
) => {

  const user = (req as any).user;

  const result =
    await fosterService.registerFoster(user.id);

  res.json({
    success: true,
    data: result
  });

};

export const getAssignmentsController = async (
  req: Request,
  res: Response
) => {
  const user = (req as any).user;

  const assignments = await fosterService.getAssignments(user.id, user.role);

  res.json({
    success: true,
    data: assignments
  });
};

export const approveFosterController = async (
  req: Request,
  res: Response
) => {

  const result =
    await fosterService.approveFoster(req.params.id as string);

  res.json({
    success: true,
    data: result
  });

};

export const assignPetController = async (
  req: Request,
  res: Response
) => {

  const staff = (req as any).user;

  const assignment =
    await fosterService.assignPetToFoster(
      req.body,
      staff.id
    );

  res.status(201).json({
    success: true,
    data: assignment
  });

};

export const returnPetController = async (
  req: Request,
  res: Response
) => {

  const result =
    await fosterService.returnPetFromFoster(
      req.params.id as string
    );

  res.json({
    success: true,
    data: result
  });

};
