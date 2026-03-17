import { Server } from "socket.io";
import { sendMessage } from "./message.service";

export const initSocket = (server: any) => {

  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {

    console.log("User connected");

    socket.on("conversation:join", (conversationId) => {

      socket.join(conversationId);

    });

    socket.on(
      "message:send",
      async ({ conversationId, senderId, content }) => {

        const message = await sendMessage(
          conversationId,
          senderId,
          content
        );

        io.to(conversationId).emit(
          "message:received",
          message
        );

      }
    );

  });

};