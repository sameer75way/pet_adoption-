"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const message_service_1 = require("./message.service");
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*"
        }
    });
    io.on("connection", (socket) => {
        console.log("User connected");
        socket.on("conversation:join", (conversationId) => {
            socket.join(conversationId);
        });
        socket.on("message:send", async ({ conversationId, senderId, content }) => {
            const message = await (0, message_service_1.sendMessage)(conversationId, senderId, content);
            io.to(conversationId).emit("message:received", message);
        });
    });
};
exports.initSocket = initSocket;
//# sourceMappingURL=socket.js.map