import { Server, PORT } from "./config/index.js";

const server = new Server({
  port: PORT,
});
server.start();
