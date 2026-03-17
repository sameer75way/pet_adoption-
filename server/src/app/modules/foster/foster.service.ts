import { FosterAssignment } from "./foster.model";
import { Pet } from "../pet/pet.model";
import { User } from "../user/user.model";
import { createNotification } from "../notification/notification.service";

export const getApplicants = async () => {
  return User.find({
    role: "Adopter",
    $or: [
      { fosterRegistrationSubmitted: true },
      { isFosterApproved: true }
    ]
  }).select("-password");
};

export const getAssignments = async (userId: string, role: string) => {
  const query = role === "Adopter" ? { fosterParent: userId } : {};

  return FosterAssignment.find(query)
    .populate("pet")
    .populate("fosterParent")
    .populate("assignedBy")
    .sort({ createdAt: -1 });
};

export const registerFoster = async (userId: string) => {

  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  if (user.isFosterApproved) {
    throw new Error("You are already approved as a foster parent");
  }

  if (user.fosterRegistrationSubmitted) {
    throw new Error("Your foster registration is already under review");
  }

  user.isFosterApproved = false;
  user.fosterRegistrationSubmitted = true;

  await user.save();

  await createNotification(
    userId,
    "Foster registration submitted",
    "Your foster registration has been recorded and is awaiting review."
  );

  return user;

};

export const approveFoster = async (userId: string) => {

  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  user.isFosterApproved = true;
  user.fosterRegistrationSubmitted = false;

  await user.save();

  await createNotification(
    userId,
    "Foster registration approved",
    "You can now be assigned pets for foster placement."
  );

  return user;

};

export const assignPetToFoster = async (
  data: any,
  staffId: string
) => {

  const assignment = await FosterAssignment.create({
    pet: data.pet || data.petId,
    fosterParent: data.fosterParent || data.fosterParentId,
    startDate: data.startDate,
    expectedEndDate: data.expectedEndDate,
    notes: data.notes,
    assignedBy: staffId
  });

  await Pet.findByIdAndUpdate(data.pet || data.petId, {
    status: "foster_placed"
  });

  const populatedAssignment = await FosterAssignment.findById(assignment._id)
    .populate("pet")
    .populate("fosterParent")
    .populate("assignedBy");

  const fosterParentId = (data.fosterParent || data.fosterParentId) as string;
  await createNotification(
    fosterParentId,
    "New foster assignment",
    "A pet has been assigned to you for foster care."
  );

  return populatedAssignment;

};

export const returnPetFromFoster = async (assignmentId: string) => {

  const assignment = await FosterAssignment.findById(
    assignmentId
  );

  if (!assignment) throw new Error("Assignment not found");

  assignment.status = "completed";
  assignment.actualEndDate = new Date();

  await assignment.save();

  await Pet.findByIdAndUpdate(assignment.pet, {
    status: "available"
  });

  return FosterAssignment.findById(assignment._id)
    .populate("pet")
    .populate("fosterParent")
    .populate("assignedBy");

};
