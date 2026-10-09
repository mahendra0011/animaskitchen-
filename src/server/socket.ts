import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "node:http";

let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: HTTPServer) {
  if (io) return io;

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join room for specific order (customer / rider tracking)
    socket.on("join:order", (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`[Socket.io] ${socket.id} joined order:${orderId}`);
    });

    // Kitchen Display System room
    socket.on("join:kds", () => {
      socket.join("room:kds");
      console.log(`[Socket.io] ${socket.id} joined room:kds`);
    });

    // Rider live location update broadcast
    socket.on("rider:location_update", (data: { orderId: string; lat: number; lng: number; heading?: number }) => {
      if (io && data.orderId) {
        io.to(`order:${data.orderId}`).emit("rider:location", data);
      }
    });

    // Order status progression broadcast (placed -> preparing -> out_for_delivery -> delivered)
    socket.on("order:status_change", (data: { orderId: string; status: string; step?: string }) => {
      if (io && data.orderId) {
        io.to(`order:${data.orderId}`).emit("order:updated", data);
        io.to("room:kds").emit("order:status_updated", data);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getSocketServer(): SocketIOServer | null {
  return io;
}

// Helper to broadcast order event from anywhere in backend
export function broadcastOrderUpdate(orderId: string, event: string, payload: any) {
  if (io) {
    io.to(`order:${orderId}`).emit(event, payload);
    io.to("room:kds").emit(event, payload);
    io.emit("orders:refresh", { orderId, timestamp: Date.now() });
  }
}
