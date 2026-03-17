import { Application } from "./application.model";
import { Pet } from "../pet/pet.model";
import { User } from "../user/user.model";
import { Conversation } from "../message/conversation.model";
import { createNotification } from "../notification/notification.service";
import { emitToRoles, emitToUser } from "../message/socket";

export const submitApplication = async (
  data: any,
  userId: string
) => {

  const existing = await Application.findOne({
    pet: data.pet,
    applicant: userId,
    status: { $nin: ["rejected", "withdrawn"] }
  });

  if (existing) {
    throw new Error(
      "You already have an active application for this pet"
    );
  }

  const pet = await Pet.findById(data.pet);

  if (!pet) {
    throw new Error("Pet not found");
  }

  if (pet.status !== "available") {
    throw new Error("This pet is not currently available for adoption");
  }

  const application = await Application.create({
    ...data,
    applicant: userId
  });

  const staffMember = await User.findOne({
    role: { $in: ["Admin", "Staff"] }
  });

  if (staffMember) {
    const conversation = await Conversation.create({
      participants: [application.applicant, staffMember._id],
      relatedApplication: application._id
    });

    await createNotification(
      staffMember._id.toString(),
      "New adoption application",
      `A new application has been submitted for ${pet.name}.`
    );
  }

  const populatedApplication = await Application.findById(application._id)
    .populate("pet")
    .populate("applicant");

  emitToRoles(["Admin", "Staff"], "application:submitted", populatedApplication);

  if (populatedApplication?.applicant && typeof populatedApplication.applicant !== "string") {
    emitToUser(
      populatedApplication.applicant._id.toString(),
      "application:updated",
      populatedApplication
    );
  }

  return populatedApplication;
};

export const getMyApplications = async (userId: string) => {
  return Application.find({ applicant: userId })
    .populate("pet")
    .populate("applicant")
    .sort({ createdAt: -1 });
};

export const getApplications = async (queryParams: any = {}) => {
  const { page = 1, limit = 20, status } = queryParams;
  const query: Record<string, unknown> = {};

  if (status) {
    query.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [applications, total] = await Promise.all([
    Application.find(query)
      .populate("pet")
      .populate("applicant")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Application.countDocuments(query)
  ]);

  return {
    data: applications,
    totalPages: Math.max(1, Math.ceil(total / Number(limit))),
    currentPage: Number(page),
    meta: {
      total,
      page: Number(page),
      limit: Number(limit)
    }
  };

};

export const updateApplicationStatus = async (
  id: string,
  status: string,
  reason?: string
) => {

  const application = await Application.findById(id);

  if (!application) {
    throw new Error("Application not found");
  }

  const currentStatus = application.status;

  if (currentStatus === "submitted" && status === "under_review") {
    application.status = status;
  }

  else if (currentStatus === "under_review" && status === "approved") {

    application.status = status;

    await Pet.findByIdAndUpdate(application.pet, {
      status: "adoption_pending"
    });

  }

  else if (currentStatus === "under_review" && status === "rejected") {

    application.status = status;

    application.rejectionReason = reason;

  }

  else {

    throw new Error("Invalid status transition");

  }

  await application.save();

  const populatedApplication = await Application.findById(application._id)
    .populate("pet")
    .populate("applicant");

  if (populatedApplication?.applicant && typeof populatedApplication.applicant !== "string") {
    const applicantId = populatedApplication.applicant._id.toString();
    await createNotification(
      applicantId,
      "Application status updated",
      `Your application is now ${application.status.replace("_", " ")}.`
    );

    emitToUser(applicantId, "application:updated", populatedApplication);
  }

  emitToRoles(["Admin", "Staff"], "application:updated", populatedApplication);

  return populatedApplication;

};
