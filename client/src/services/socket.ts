import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

const getSocketUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return baseUrl.replace(/\/api\/?$/, "");
};

export const connectSocket = (token: string) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(getSocketUrl(), {
    transports: ["websocket", "polling"],
    withCredentials: true,
    auth: {
      token,
    },
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
