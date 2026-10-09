import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "node:http";

let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: HTTPServer) {
  if (io) return io;

  const allowedOrigins = [
    process.env["APP_URL"] || "",
    process.env["FRONTEND_URL"] || "",
    "https://animaskitchen.com",
    "https://www.animaskitchen.com",
    "https://animas-kitchen-frontend.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",
    "capacitor://localhost",
    "ionic://localhost",
  ].filter(Boolean);

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigins.length > 0 ? allowedOrigins : false,
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
    socket.on(
      "rider:location_update",
      (data: { orderId: string; lat: number; lng: number; heading?: number }) => {
        if (io && data.orderId) {
          io.to(`order:${data.orderId}`).emit("rider:location", data);
        }
      },
    );

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
// NOTE: Nitro/serverless `fetch` handlers have no long-lived HTTP server, so
// `initSocketServer` is not invoked there and this is a safe no-op. The
// frontend treats polling (`GET /api/orders` every 8s) as source of truth and
// uses socket events only as a refresh hint when a standalone socket server
// is deployed.
export function broadcastOrderUpdate(orderId: string, event: string, payload: any) {
  if (io) {
    io.to(`order:${orderId}`).emit(event, payload);
    io.to("room:kds").emit(event, payload);
    io.emit("orders:refresh", { orderId, timestamp: Date.now() });
  } else if (process.env["NODE_ENV"] !== "production") {
    console.log(`[Socket.io] (no-op, no socket server) ${event} for ${orderId}`);
  }
}
