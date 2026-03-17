import http from "http";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";

type AuthenticatedSocket = Socket & {
  data: {
    user?: {
      id: string;
      role: string;
    };
  };
};

let io: Server | null = null;

const getAllowedOrigin = () => process.env.CLIENT_URL || "*";

const getUserRoom = (userId: string) => `user:${userId}`;
const getRoleRoom = (role: string) => `role:${role}`;
const getConversationRoom = (conversationId: string) =>
  `conversation:${conversationId}`;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: getAllowedOrigin(),
      credentials: true,
    },
  });

  io.use((socket: AuthenticatedSocket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      ) as { id: string; role: string };

      socket.data.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const user = socket.data.user;

    if (!user) {
      socket.disconnect();
      return;
    }

    socket.join(getUserRoom(user.id));
    socket.join(getRoleRoom(user.role));
    socket.join("pets");

    socket.on("conversation:join", (conversationId: string) => {
      socket.join(getConversationRoom(conversationId));
    });

    socket.on("conversation:leave", (conversationId: string) => {
      socket.leave(getConversationRoom(conversationId));
    });
  });

  return io;
};

export const getIO = () => io;

export const emitToUser = (userId: string, event: string, payload: unknown) => {
  io?.to(getUserRoom(userId)).emit(event, payload);
};

export const emitToRoles = (
  roles: string[],
  event: string,
  payload: unknown
) => {
  roles.forEach((role) => {
    io?.to(getRoleRoom(role)).emit(event, payload);
  });
};

export const emitToConversation = (
  conversationId: string,
  event: string,
  payload: unknown
) => {
  io?.to(getConversationRoom(conversationId)).emit(event, payload);
};

export const emitPetsUpdated = (payload: unknown) => {
  io?.to("pets").emit("pet:updated", payload);
};
