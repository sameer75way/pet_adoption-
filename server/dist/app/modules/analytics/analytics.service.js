"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverview = void 0;
const pet_model_1 = require("../pet/pet.model");
const application_model_1 = require("../application/application.model");
const getOverview = async () => {
    const [totalPets, adoptedPets, applications, pets, applicationGroups] = await Promise.all([
        pet_model_1.Pet.countDocuments(),
        pet_model_1.Pet.countDocuments({
            status: "adopted"
        }),
        application_model_1.Application.countDocuments(),
        pet_model_1.Pet.find().select("intakeDate adoptedAt status createdAt"),
        application_model_1.Application.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])
    ]);
    const adoptedWithDates = pets.filter((pet) => pet.intakeDate && pet.adoptedAt);
    const averageStayDuration = adoptedWithDates.length === 0
        ? 0
        : adoptedWithDates.reduce((sum, pet) => {
            const intake = new Date(pet.intakeDate).getTime();
            const adopted = new Date(pet.adoptedAt).getTime();
            return sum + Math.max(0, Math.round((adopted - intake) / (1000 * 60 * 60 * 24)));
        }, 0) / adoptedWithDates.length;
    const intakeTrendsMap = pets.reduce((acc, pet) => {
        const date = new Date(pet.intakeDate || pet.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    return {
        totalPets,
        adoptedPets,
        adoptionRate: totalPets === 0
            ? 0
            : Number(((adoptedPets / totalPets) * 100).toFixed(1)),
        totalApplications: applications,
        averageStayDuration: Number(averageStayDuration.toFixed(1)),
        intakeTrends: Object.entries(intakeTrendsMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, count]) => ({ month, count })),
        applicationsByStatus: applicationGroups.map((group) => ({
            status: group._id,
            count: group.count
        }))
    };
};
exports.getOverview = getOverview;
//# sourceMappingURL=analytics.service.js.map