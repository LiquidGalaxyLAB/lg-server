import express from "express";
import { appRouter } from "../routers/index.js";
import errorMiddleWare from "../middleware/error.middleware.js";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import cors from "cors";

export class Server {
  constructor(config) {
    this.config = config || {};
    this.app = express();
    
    this.server = http.createServer(this.app);

    this.wss = new WebSocketServer({ server: this.server });

    this.currentCommand = "";

    this.app.use(express.json());
    this.app.use(cors("*"));
    this.app.get("/ping", (req, res) => {
      return res.status(200).json({ message: "pong@@" });
    });

    this.app.use(express.static(path.join(process.cwd(), "public")));

    this.wss.on("connection", (ws) => {
      ws.send(this.currentCommand);
    });

    this.app.use((req, res, next) => {
      if (req.method === "POST" && req.path.startsWith("/api/")) {
        this.currentCommand = req.path;
        this.wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(this.currentCommand);
          }
        });
      }
      next();
    });

    this.app.use("/api", appRouter);
    this.app.use(errorMiddleWare);
  }

  start() {
    // Changed default port to 3000 since 80 requires root privileges
    const port = this.config.port || 3000;
    this.server.listen(port, (err) => {
      if (err) {
        console.error(`Failed to start server: ${err.message}`);
        process.exit(1);
      } else {
        console.log(`Server is running at http://localhost:${port}`);
      }
    });
  }
}