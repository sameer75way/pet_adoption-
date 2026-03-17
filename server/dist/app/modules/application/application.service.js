"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getApplications = exports.getMyApplications = exports.submitApplication = void 0;
const application_model_1 = require("./application.model");
const pet_model_1 = require("../pet/pet.model");
const user_model_1 = require("../user/user.model");
const conversation_model_1 = require("../message/conversation.model");
const notification_service_1 = require("../notification/notification.service");
const submitApplication = async (data, userId) => {
    const existing = await application_model_1.Application.findOne({
        pet: data.pet,
        applicant: userId,
        status: { $nin: ["rejected", "withdrawn"] }
    });
    if (existing) {
        throw new Error("You already have an active application for this pet");
    }
    const pet = await pet_model_1.Pet.findById(data.pet);
    if (!pet) {
        throw new Error("Pet not found");
    }
    if (pet.status !== "available") {
        throw new Error("This pet is not currently available for adoption");
    }
    const application = await application_model_1.Application.create({
        ...data,
        applicant: userId
    });
    const staffMember = await user_model_1.User.findOne({
        role: { $in: ["Admin", "Staff"] }
    });
    if (staffMember) {
        await conversation_model_1.Conversation.create({
            participants: [application.applicant, staffMember._id],
            relatedApplication: application._id
        });
        await (0, notification_service_1.createNotification)(staffMember._id.toString(), "New adoption application", `A new application has been submitted for ${pet.name}.`);
    }
    return application_model_1.Application.findById(application._id)
        .populate("pet")
        .populate("applicant");
};
exports.submitApplication = submitApplication;
const getMyApplications = async (userId) => {
    return application_model_1.Application.find({ applicant: userId })
        .populate("pet")
        .populate("applicant")
        .sort({ createdAt: -1 });
};
exports.getMyApplications = getMyApplications;
const getApplications = async (queryParams = {}) => {
    const { page = 1, limit = 20, status } = queryParams;
    const query = {};
    if (status) {
        query.status = status;
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [applications, total] = await Promise.all([
        application_model_1.Application.find(query)
            .populate("pet")
            .populate("applicant")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        application_model_1.Application.countDocuments(query)
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
exports.getApplications = getApplications;
const updateApplicationStatus = async (id, status, reason) => {
    const application = await application_model_1.Application.findById(id);
    if (!application) {
        throw new Error("Application not found");
    }
    const currentStatus = application.status;
    if (currentStatus === "submitted" && status === "under_review") {
        application.status = status;
    }
    else if (currentStatus === "under_review" && status === "approved") {
        application.status = status;
        await pet_model_1.Pet.findByIdAndUpdate(application.pet, {
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
    const populatedApplication = await application_model_1.Application.findById(application._id)
        .populate("pet")
        .populate("applicant");
    if (populatedApplication?.applicant && typeof populatedApplication.applicant !== "string") {
        const applicantId = populatedApplication.applicant._id.toString();
        await (0, notification_service_1.createNotification)(applicantId, "Application status updated", `Your application is now ${application.status.replace("_", " ")}.`);
    }
    return populatedApplication;
};
exports.updateApplicationStatus = updateApplicationStatus;
//# sourceMappingURL=application.service.js.map