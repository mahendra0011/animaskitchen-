import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getClientSocket(): Socket | null {
  if (!socket) {
    try {
      const serverUrl =
        typeof window !== "undefined"
          ? (window as any).ENV?.VITE_BACKEND_URL ||
            import.meta.env["VITE_BACKEND_URL"] ||
            window.location.origin
          : "http://localhost:10000";

      socket = io(serverUrl, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        timeout: 8000,
        autoConnect: true,
      });

      socket.on("connect", () => {
        console.log("[Socket.io] Connected to realtime gateway:", socket?.id);
      });

      socket.on("connect_error", (err: unknown) => {
        // Expected on serverless deployments without a socket server —
        // polling (`GET /api/orders`) remains the source of truth.
        console.warn("[Socket.io] Realtime unavailable, using polling fallback:", String(err).substring(0, 120));
      });
    } catch (err: unknown) {
      console.warn("[Socket.io] Init failed, using polling fallback.");
      return null;
    }
  }

  return socket;
}

export function subscribeToOrder(orderId: string, onUpdate: (data: any) => void) {
  const s = getClientSocket();
  if (!s) return () => {};
  try {
    s.emit("join:order", orderId);
    s.on("order:updated", onUpdate);
    s.on("rider:location", onUpdate);
  } catch (e: unknown) {
    return () => {};
  }

  return () => {
    try {
      s.off("order:updated", onUpdate);
      s.off("rider:location", onUpdate);
    } catch {
      // noop
    }
  };
}

export function subscribeToKDS(onOrderChange: (data: any) => void) {
  const s = getClientSocket();
  if (!s) return () => {};
  try {
    s.emit("join:kds");
    s.on("order:status_updated", onOrderChange);
    s.on("orders:refresh", onOrderChange);
  } catch (e: unknown) {
    return () => {};
  }

  return () => {
    try {
      s.off("order:status_updated", onOrderChange);
      s.off("orders:refresh", onOrderChange);
    } catch {
      // noop
    }
  };
}
