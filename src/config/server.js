import express from "express";
import { appRouter } from "../routers/index.js";
import errorMiddleWare from "../middleware/error.middleware.js";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";

export class Server {
  constructor(config) {
    this.config = config || {};
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    this.currentCommand = "";

    // Middleware
    this.app.use(express.json());
    this.app.use(cors("*"));

    // Basic health check route
    this.app.get("/ping", (req, res) => {
      return res.status(200).json({ message: "pong@@" });
    });

    // Main router
    this.app.use("/api", appRouter);

    // Error handling middleware
    this.app.use(errorMiddleWare);
  }

  start() {
    const port = this.config.port || 3000;
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }
}