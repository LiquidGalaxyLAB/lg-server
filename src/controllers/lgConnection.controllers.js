import {
  cleanVisualizationService,
  cleanlogosService,
  relaunchLGService,
  connectToLg,
  shutdownLGService,
  rebootLGService,
  cleanBalloonService,
  stopOrbitService,
  executeOrbitService,
  flytoService,
  showOverlayImageService,
  showBalloonService,
  sendKmlService,
} from "../services/index.js";
import AppError from "../utils/error.utils.js";
import path from "path";
import fs from "fs/promises";
export class LgConnectionController {
  connectToLg = async (req, res, next) => {
    const { ip, port, username, password } = req.body;
    const isCheckConnection = req.path === "/check-connection";
    try {
      const response = await connectToLg(
        ip,
        port,
        username,
        password,
        isCheckConnection
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(new AppError(error || "Failed to connect to LG", 500));
    }
  };

  executeOrbit = async (req, res, next) => {
    const {
      ip,
      port,
      username,
      password,
      latitude,
      longitude,
      tilt,
      elevation,
      bearing,
    } = req.body;
    try {
      const connections = await executeOrbitService(
        ip,
        port,
        username,
        password,
        latitude,
        longitude,
        tilt,
        elevation,
        bearing
      );
      return res.status(200).json(connections);
    } catch (error) {
      console.log("error", error);
      return next(new AppError(error || "Failed to execute orbit", 500));
    }
  };
  cleanVisualization = async (req, res, next) => {
    const { ip, port, username, password } = req.body;
    try {
      const response = await cleanVisualizationService(
        ip,
        port,
        username,
        password
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(new AppError(error || "Failed to Clean Visualization", 500));
    }
  };
  cleanlogos = async (req, res, next) => {
    const { ip, port, username, password, screens } = req.body;
    try {
      const response = await cleanlogosService(
        ip,
        port,
        username,
        password,
        screens
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(new AppError(error || "Failed to Clean Logo", 500));
    }
  };
  relaunchLG = async (req, res, next) => {
    const { ip, port, username, password, screens } = req.body;
    try {
      const response = await relaunchLGService(
        ip,
        port,
        username,
        password,
        screens
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(new AppError(error || "Failed to Re-launch LG ", 500));
    }
  };
  shutdownLG = async (req, res, next) => {
    const { ip, port, username, password, screens } = req.body;
    try {
      const response = await shutdownLGService(
        ip,
        port,
        username,
        password,
        screens
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(new AppError(error || "Failed to Shutdown LG ", 500));
    }
  };
  rebootLG = async (req, res, next) => {
    const { ip, port, username, password, screens } = req.body;
    try {
      const response = await rebootLGService(
        ip,
        port,
        username,
        password,
        screens
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(new AppError(error || "Failed to reboot LG", 500));
    }
  };
  stopOrbit = async (req, res, next) => {
    const { ip, port, username, password } = req.body;
    try {
      const response = await stopOrbitService(ip, port, username, password);
      return res.status(200).json(response);
    } catch (error) {
      return next(new AppError(error || "Failed to Stop Orbit ", 500));
    }
  };
  cleanBalloon = async (req, res, next) => {
    const { ip, port, username, password, screens } = req.body;
    try {
      const response = await cleanBalloonService(
        ip,
        port,
        username,
        password,
        screens
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(new AppError(error || "Failed to Clean Balloon ", 500));
    }
  };

  flyto = async (req, res, next) => {
    const {
      ip,
      port,
      username,
      password,
      latitude,
      longitude,
      tilt,
      elevation,
      bearing,
    } = req.body;
    try {
      const response = await flytoService(
        ip,
        port,
        username,
        password,
        latitude,
        longitude,
        tilt,
        elevation,
        bearing
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(new AppError(error || "Failed to fly to ", 500));
    }
  };

  showOverlayImage = async (req, res, next) => {
    const { ip, port, username, password, screens, kml } = req.body;
    try {
      const response = await showOverlayImageService(
        ip,
        port,
        username,
        password,
        screens,
        kml
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(new AppError(error || "Failed to show overlay image ", 500));
    }
  };

  showBallon = async (req, res, next) => {
    const { ip, port, username, password, screens, kml } = req.body;
    try {
      const response = await showBalloonService(
        ip,
        port,
        username,
        password,
        screens,
        kml
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(new AppError(error || "Failed to show balloon ", 500));
    }
  };

  sendKml = async (req, res, next) => {
    const { ip, port, username, password, filename } = req.body;
    const uploadedFile = req.file;

    if (!uploadedFile) {
      console.log("No file uploaded");
      return next(new AppError("No file uploaded", 400));
    }

    try {
      const localPath = path.resolve(uploadedFile.path);

      const response = await sendKmlService(
        ip,
        port,
        username,
        password,
        filename,
        localPath
      );

      // Delete the file after processing
      try {
        await fs.unlink(localPath);
        console.log(`Cleaned up temporary file: ${localPath}`);
      } catch (deleteError) {
        console.error(
          `Failed to delete temporary file: ${localPath}`,
          deleteError
        );
        // We don't throw here as the main operation was successful
      }

      return res.status(200).json(response);
    } catch (error) {
      // Clean up the file even if the operation failed
      try {
        const localPath = path.resolve(uploadedFile.path);
        await fs.unlink(localPath);
        console.log(`Cleaned up temporary file after error: ${localPath}`);
      } catch (deleteError) {
        console.error(
          `Failed to delete temporary file: ${localPath}`,
          deleteError
        );
      }

      return next(new AppError(error || "Failed to process the KML", 500));
    }
  };
}
