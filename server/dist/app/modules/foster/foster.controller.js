"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnPetController = exports.assignPetController = exports.approveFosterController = exports.getAssignmentsController = exports.registerFosterController = void 0;
const fosterService = __importStar(require("./foster.service"));
const registerFosterController = async (req, res) => {
    const user = req.user;
    const result = await fosterService.registerFoster(user.id);
    res.json({
        success: true,
        data: result
    });
};
exports.registerFosterController = registerFosterController;
const getAssignmentsController = async (req, res) => {
    const user = req.user;
    const assignments = await fosterService.getAssignments(user.id, user.role);
    res.json({
        success: true,
        data: assignments
    });
};
exports.getAssignmentsController = getAssignmentsController;
const approveFosterController = async (req, res) => {
    const result = await fosterService.approveFoster(req.params.id);
    res.json({
        success: true,
        data: result
    });
};
exports.approveFosterController = approveFosterController;
const assignPetController = async (req, res) => {
    const staff = req.user;
    const assignment = await fosterService.assignPetToFoster(req.body, staff.id);
    res.status(201).json({
        success: true,
        data: assignment
    });
};
exports.assignPetController = assignPetController;
const returnPetController = async (req, res) => {
    const result = await fosterService.returnPetFromFoster(req.params.id);
    res.json({
        success: true,
        data: result
    });
};
exports.returnPetController = returnPetController;
//# sourceMappingURL=foster.controller.js.map