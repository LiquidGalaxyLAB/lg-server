import { Router } from "express";
import { LgConnectionController } from "../controllers/index.js";
const lgConnectionController = new LgConnectionController();
const router = Router();

 router.route("/execute-orbit").post(lgConnectionController.executeOrbit);
router.route("/clean-visualization").post(lgConnectionController.cleanVisualization);
 router.route("/clean-logos").post(lgConnectionController.cleanlogos);
 router.route("/relaunch-lg").post(lgConnectionController.relaunchLG);
 router.route("/reboot-lg").post(lgConnectionController.rebootLG);
 router.route("/stop-orbit").post(lgConnectionController.stopOrbit);
router.route("/clean-balloon").post(lgConnectionController.cleanBalloon);
export default router;