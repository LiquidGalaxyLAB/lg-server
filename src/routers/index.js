import { Router } from "express";
import LgConnectionRouter from "./lgConnection.router.js";

const appRouter = Router();
appRouter.use("/lg-connection", LgConnectionRouter);

export { appRouter };
