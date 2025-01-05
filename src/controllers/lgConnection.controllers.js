import { cleanVisualizationService, cleanlogosService, relaunchLGService, shutdownLGService, rebootLGService, cleanBalloonService, stopOrbitService, executeOrbitService, flytoService, showOverlayImageService, showBalloonService, sendKmlService } from "../services/index.js";
import AppError from "../utilis/error.utils.js";
import path from 'path';
export class LgConnectionController {
    executeOrbit = async (req, res, next) => {
        const { host, sshPort, username, password } = req.body;
        try {
            const connections = await executeOrbitService(host, sshPort, username, password);
            return res.status(200).json(connections);
        } catch (error) {
            console.log("error", error);
            return next(new AppError(error || "Failed to execute orbit", 500));
        }

    }
    cleanVisualization = async (req, res, next) => {
        const { host, sshPort, username, password } = req.body;
        try {
            const response = await cleanVisualizationService(host, sshPort, username, password);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to Clean Visualization", 500));
        }
    }
    cleanlogos = async (req, res, next) => {
        const { host, sshPort, username, password, numberofrigs } = req.body;
        try {
            const response = await cleanlogosService(host, sshPort, username, password, numberofrigs);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to Clean Logo", 500));
        }
    }
    relaunchLG = async (req, res, next) => {
        const { host, sshPort, username, password, numberofrigs } = req.body;
        try {
            const response = await relaunchLGService(host, sshPort, username, password, numberofrigs);
            return res.status(200).json(response);

        } catch (error) {
            return next(new AppError(error || "Failed to Re-launch LG ", 500));
        }
    }
    shutdownLG = async (req, res, next) => {
        const { host, sshPort, username, password, numberofrigs } = req.body;
        try {
            const response = await shutdownLGService(host, sshPort, username, password, numberofrigs);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to Shutdown LG ", 500));
        }

    }
    rebootLG = async (req, res, next) => {
        const { host, sshPort, username, password, numberofrigs } = req.body;
        try {
            const response = await rebootLGService(host, sshPort, username, password, numberofrigs);
            return res.status(200).json(response);

        } catch (error) {
            return next(new AppError(error || "Failed to reboot LG", 500));
        }
    }
    stopOrbit = async (req, res, next) => {
        const { host, sshPort, username, password } = req.body;
        try {
            const response = await stopOrbitService(host, sshPort, username, password);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to Stop Orbit ", 500));
        }
    }
    cleanBalloon = async (req, res, next) => {
        const { host, sshPort, username, password, numberofrigs } = req.body;
        try {
            const response = await cleanBalloonService(host, sshPort, username, password, numberofrigs);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to Clean Balloon ", 500));
        }

    }

    flyto = async (req, res, next) => {
        const { host, sshPort, username, password, latitude, longitude, tilt, bearing, numberofrigs } = req.body;
        try {
            const response = await flytoService(host, sshPort, username, password, latitude, longitude, tilt, bearing, numberofrigs);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to fly to ", 500));
        }
    }

    showOverlayImage = async (req, res, next) => {
        const { host, sshPort, username, password, numberofrigs, imageKml } = req.body;
        try {
            const response = await showOverlayImageService(host, sshPort, username, password, numberofrigs, imageKml);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to show overlay image ", 500));
        }
    }

    showBallon = async (req, res, next) => {
        const { host, sshPort, username, password, numberofrigs, balloonKml } = req.body;
        try {
            const response = await showBalloonService(host, sshPort, username, password, numberofrigs, balloonKml);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to show balloon ", 500));
        }
    }

    


    sendKml = async (req, res, next) => {
        const { host, sshPort, username, password, projectname } = req.body;
    
        // Access the uploaded file
        const uploadedFile = req.file;
    
        if (!uploadedFile) {
            console.log("No file uploaded");
            return next(new AppError("No file uploaded", 400));
        }
    
        try {
            const localPath = path.resolve(uploadedFile.path);
    
            // Call the service function
            const response = await sendKmlService(
                host,
                sshPort,
                username,
                password,
                projectname,
                localPath
            );
    
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to process the KML", 500));
        }
    };
    
    
}
