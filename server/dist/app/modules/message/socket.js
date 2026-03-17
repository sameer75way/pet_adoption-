"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitPetsUpdated = exports.emitToConversation = exports.emitToRoles = exports.emitToUser = exports.getIO = exports.initSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socket_io_1 = require("socket.io");
let io = null;
const getAllowedOrigin = () => process.env.CLIENT_URL || "*";
const getUserRoom = (userId) => `user:${userId}`;
const getRoleRoom = (role) => `role:${role}`;
const getConversationRoom = (conversationId) => `conversation:${conversationId}`;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: getAllowedOrigin(),
            credentials: true,
        },
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return next(new Error("Unauthorized"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
            socket.data.user = {
                id: decoded.id,
                role: decoded.role,
            };
            next();
        }
        catch {
            next(new Error("Invalid token"));
        }
    });
    io.on("connection", (socket) => {
        const user = socket.data.user;
        if (!user) {
            socket.disconnect();
            return;
        }
        socket.join(getUserRoom(user.id));
        socket.join(getRoleRoom(user.role));
        socket.join("pets");
        socket.on("conversation:join", (conversationId) => {
            socket.join(getConversationRoom(conversationId));
        });
        socket.on("conversation:leave", (conversationId) => {
            socket.leave(getConversationRoom(conversationId));
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => io;
exports.getIO = getIO;
const emitToUser = (userId, event, payload) => {
    io?.to(getUserRoom(userId)).emit(event, payload);
};
exports.emitToUser = emitToUser;
const emitToRoles = (roles, event, payload) => {
    roles.forEach((role) => {
        io?.to(getRoleRoom(role)).emit(event, payload);
    });
};
exports.emitToRoles = emitToRoles;
const emitToConversation = (conversationId, event, payload) => {
    io?.to(getConversationRoom(conversationId)).emit(event, payload);
};
exports.emitToConversation = emitToConversation;
const emitPetsUpdated = (payload) => {
    io?.to("pets").emit("pet:updated", payload);
};
exports.emitPetsUpdated = emitPetsUpdated;
//# sourceMappingURL=socket.js.map