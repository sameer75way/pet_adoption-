"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnPetFromFoster = exports.assignPetToFoster = exports.approveFoster = exports.registerFoster = exports.getAssignments = exports.getApplicants = void 0;
const foster_model_1 = require("./foster.model");
const pet_model_1 = require("../pet/pet.model");
const user_model_1 = require("../user/user.model");
const notification_service_1 = require("../notification/notification.service");
const socket_1 = require("../message/socket");
const getApplicants = async () => {
    return user_model_1.User.find({
        role: "Adopter",
        $or: [
            { fosterRegistrationSubmitted: true },
            { isFosterApproved: true }
        ]
    }).select("-password");
};
exports.getApplicants = getApplicants;
const getAssignments = async (userId, role) => {
    const query = role === "Adopter" ? { fosterParent: userId } : {};
    return foster_model_1.FosterAssignment.find(query)
        .populate("pet")
        .populate("fosterParent")
        .populate("assignedBy")
        .sort({ createdAt: -1 });
};
exports.getAssignments = getAssignments;
const registerFoster = async (userId) => {
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new Error("User not found");
    if (user.isFosterApproved) {
        throw new Error("You are already approved as a foster parent");
    }
    if (user.fosterRegistrationSubmitted) {
        throw new Error("Your foster registration is already under review");
    }
    user.isFosterApproved = false;
    user.fosterRegistrationSubmitted = true;
    await user.save();
    await (0, notification_service_1.createNotification)(userId, "Foster registration submitted", "Your foster registration has been recorded and is awaiting review.");
    (0, socket_1.emitToRoles)(["Admin", "Staff"], "foster:applicant-updated", user);
    (0, socket_1.emitToUser)(userId, "foster:applicant-updated", user);
    return user;
};
exports.registerFoster = registerFoster;
const approveFoster = async (userId) => {
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new Error("User not found");
    user.isFosterApproved = true;
    user.fosterRegistrationSubmitted = false;
    await user.save();
    await (0, notification_service_1.createNotification)(userId, "Foster registration approved", "You can now be assigned pets for foster placement.");
    (0, socket_1.emitToRoles)(["Admin", "Staff"], "foster:applicant-updated", user);
    (0, socket_1.emitToUser)(userId, "foster:applicant-updated", user);
    return user;
};
exports.approveFoster = approveFoster;
const assignPetToFoster = async (data, staffId) => {
    const assignment = await foster_model_1.FosterAssignment.create({
        pet: data.pet || data.petId,
        fosterParent: data.fosterParent || data.fosterParentId,
        startDate: data.startDate,
        expectedEndDate: data.expectedEndDate,
        notes: data.notes,
        assignedBy: staffId
    });
    await pet_model_1.Pet.findByIdAndUpdate(data.pet || data.petId, {
        status: "foster_placed"
    });
    const populatedAssignment = await foster_model_1.FosterAssignment.findById(assignment._id)
        .populate("pet")
        .populate("fosterParent")
        .populate("assignedBy");
    const fosterParentId = (data.fosterParent || data.fosterParentId);
    await (0, notification_service_1.createNotification)(fosterParentId, "New foster assignment", "A pet has been assigned to you for foster care.");
    (0, socket_1.emitToUser)(fosterParentId, "foster:assignment-updated", populatedAssignment);
    (0, socket_1.emitToRoles)(["Admin", "Staff"], "foster:assignment-updated", populatedAssignment);
    (0, socket_1.emitPetsUpdated)({
        type: "status",
        petId: data.pet || data.petId,
        status: "foster_placed"
    });
    return populatedAssignment;
};
exports.assignPetToFoster = assignPetToFoster;
const returnPetFromFoster = async (assignmentId) => {
    const assignment = await foster_model_1.FosterAssignment.findById(assignmentId);
    if (!assignment)
        throw new Error("Assignment not found");
    assignment.status = "completed";
    assignment.actualEndDate = new Date();
    await assignment.save();
    await pet_model_1.Pet.findByIdAndUpdate(assignment.pet, {
        status: "available"
    });
    const populatedAssignment = await foster_model_1.FosterAssignment.findById(assignment._id)
        .populate("pet")
        .populate("fosterParent")
        .populate("assignedBy");
    if (populatedAssignment?.fosterParent) {
        const fosterParentId = populatedAssignment.fosterParent?._id?.toString?.() ||
            populatedAssignment.fosterParent.toString();
        (0, socket_1.emitToUser)(fosterParentId, "foster:assignment-updated", populatedAssignment);
    }
    (0, socket_1.emitToRoles)(["Admin", "Staff"], "foster:assignment-updated", populatedAssignment);
    (0, socket_1.emitPetsUpdated)({
        type: "status",
        petId: assignment.pet,
        status: "available"
    });
    return populatedAssignment;
};
exports.returnPetFromFoster = returnPetFromFoster;
//# sourceMappingURL=foster.service.js.map