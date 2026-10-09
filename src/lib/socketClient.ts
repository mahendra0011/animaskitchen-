import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getClientSocket(): Socket {
  if (!socket) {
    const serverUrl =
      typeof window !== "undefined"
        ? (window as any).ENV?.VITE_BACKEND_URL ||
          import.meta.env.VITE_BACKEND_URL ||
          window.location.origin
        : "http://localhost:10000";

    socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("[Socket.io] Connected to realtime gateway:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket.io] Realtime connection fallback to polling:", err.message);
    });
  }

  return socket;
}

export function subscribeToOrder(orderId: string, onUpdate: (data: any) => void) {
  const s = getClientSocket();
  s.emit("join:order", orderId);
  s.on("order:updated", onUpdate);
  s.on("rider:location", onUpdate);

  return () => {
    s.off("order:updated", onUpdate);
    s.off("rider:location", onUpdate);
  };
}

export function subscribeToKDS(onOrderChange: (data: any) => void) {
  const s = getClientSocket();
  s.emit("join:kds");
  s.on("order:status_updated", onOrderChange);
  s.on("orders:refresh", onOrderChange);

  return () => {
    s.off("order:status_updated", onOrderChange);
    s.off("orders:refresh", onOrderChange);
  };
}
