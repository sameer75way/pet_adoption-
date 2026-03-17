import { Request, Response } from "express";
import * as medicalService from "./medical.service";

export const addMedicalRecordController = async (
  req: Request,
  res: Response
) => {

  const user = (req as any).user;

  const record =
    await medicalService.addMedicalRecord(
      req.params.petId as string,
      req.body,
      user.id
    );

  res.status(201).json({
    success: true,
    data: record
  });

};

export const getAllMedicalRecordsController = async (
  req: Request,
  res: Response
) => {
  const records = await medicalService.getAllMedicalRecords();

  res.json({
    success: true,
    data: records
  });
};

export const getMedicalHistoryController = async (
  req: Request,
  res: Response
) => {

  const history =
    await medicalService.getMedicalHistory(
      req.params.petId as string
    );

  res.json({
    success: true,
    data: history
  });

};

export const getMedicalSummaryController = async (
  req: Request,
  res: Response
) => {

  const summary =
    await medicalService.getMedicalSummary(
      req.params.petId as string
    );

  res.json({
    success: true,
    data: summary
  });

};
