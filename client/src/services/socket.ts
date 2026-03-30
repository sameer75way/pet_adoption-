import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const realtimeFlag = import.meta.env.VITE_ENABLE_REALTIME;
const realtimeEnabled =
  realtimeFlag === "true" ||
  (realtimeFlag !== "false" && !apiBaseUrl.startsWith("/"));
const realtimePollMs = Number(import.meta.env.VITE_REALTIME_POLL_MS || 15000);

const getSocketUrl = () => {
  return apiBaseUrl.replace(/\/api\/?$/, "");
};

export const connectSocket = (token: string) => {
  if (!realtimeEnabled || !token) {
    return null;
  }

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
export const isRealtimeEnabled = () => realtimeEnabled;
export const getRealtimePollMs = () => realtimePollMs;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
