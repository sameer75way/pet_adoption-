import { Request, Response } from "express";
import * as applicationService from "./application.service";

export const submitApplicationController = async (
  req: Request,
  res: Response
) => {

  const user = (req as any).user;

  const application =
    await applicationService.submitApplication(
      req.body,
      user.id
    );

  res.status(201).json({
    success: true,
    data: application
  });

};

export const getMyApplicationsController = async (
  req: Request,
  res: Response
) => {
  const user = (req as any).user;

  const apps = await applicationService.getMyApplications(user.id);

  res.json({
    success: true,
    data: apps
  });
};

export const getApplicationsController = async (
  req: Request,
  res: Response
) => {

  const apps =
    await applicationService.getApplications(req.query);

  res.json({
    success: true,
    ...apps
  });

};

export const updateApplicationStatusController = async (
  req: Request,
  res: Response
) => {

  const { status, reason, rejectionReason } = req.body;

  const app =
    await applicationService.updateApplicationStatus(
      req.params.id as string,
      status,
      rejectionReason || reason
    );

  res.json({
    success: true,
    data: app
  });

};
