import { Audit } from "./audit.model";

export const logAudit = async (
  actor: string,
  action: string,
  resourceId: string
) => {

  await Audit.create({
    actor,
    action,
    resourceId
  });

};