import { Router } from "express";
import { LgConnectionController } from "../controllers/index.js";
import multer from "multer";

const lgConnectionController = new LgConnectionController();
const router = Router();
const upload = multer({ dest: "uploads/" });

router.route("/check-connection").post(lgConnectionController.connectToLg);
router.route("/connect-lg").post(lgConnectionController.connectToLg);
router.route("/execute-orbit").post(lgConnectionController.executeOrbit);
router
  .route("/clean-visualization")
  .post(lgConnectionController.cleanVisualization);
router.route("/clean-logos").post(lgConnectionController.cleanlogos);
router.route("/relaunch-lg").post(lgConnectionController.relaunchLG);
router.route("/reboot-lg").post(lgConnectionController.rebootLG);
router.route("/shutdown-lg").post(lgConnectionController.shutdownLG);
router.route("/stop-orbit").post(lgConnectionController.stopOrbit);
router.route("/clean-balloon").post(lgConnectionController.cleanBalloon);
router.route("/flyto").post(lgConnectionController.flyto);
router.route("/show-logo").post(lgConnectionController.showOverlayImage);
router.route("/show-balloon").post(lgConnectionController.showBallon);
router
  .route("/send-kml")
  .post(upload.single("file"), lgConnectionController.sendKml);

export default router;
