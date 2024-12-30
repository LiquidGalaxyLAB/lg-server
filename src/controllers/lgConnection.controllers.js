import { cleanVisualizationService, cleanlogosService, relaunchLGService, shutdownLGService, rebootLGService, cleanBalloonService, stopOrbitService, executeOrbitService } from "../services/index.js";
import AppError from "../utilis/error.utils.js";
export class LgConnectionController {
    executeOrbit = async (req, res) => {
        const { host, sshPort, username, password } = req.body;
        try {
            const connections = await executeOrbitService(host, sshPort, username, password);
            return res.status(200).json(connections);
        } catch (error) {
            return next(new AppError(error || "Failed to execute orbit", 500));
        }

    }
    cleanVisualization = async (req, res) => {
        const { host, sshPort, username, password, command } = req.body;
        try {
            const response = await cleanVisualizationService(host, sshPort, username, password, command);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to Clean Visualization", 500));
        }
    }
    cleanlogos = async (req, res) => {
        const { host, sshPort, username, password } = req.body;
        try {
            const response = await cleanlogosService(host, sshPort, username, password);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to Clean Logo", 500));
        }
    }
    relaunchLG = async (req, res) => {
        const { host, sshPort, username, password, numberofrigs } = req.body;
        try {
            const response = await relaunchLGService(host, sshPort, username, password, numberofrigs);
            return res.status(200).json(response);

        } catch (error) {
            return next(new AppError(error || "Failed to Re-launch LG ", 500));
        }
    }
    shutdownLG = async (req, res) => {
        const { host, sshPort, username, password, numberofrigs } = req.body;
        try {
            const response = await shutdownLGService(host, sshPort, username, password, numberofrigs);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to Shutdown LG ", 500));
        }

    }
    rebootLG = async (req, res) => {
        const { host, sshPort, username, password, numberofrigs } = req.body;
        try {
            const response = await rebootLGService(host, sshPort, username, password, numberofrigs);
            return res.status(200).json(response);

        } catch (error) {
            return next(new AppError(error || "Failed to reboot LG", 500));
        }
    }
    stopOrbit = async (req, res) => {
        const { host, sshPort, username, password } = req.body;
        try {
            const response = await stopOrbitService(host, sshPort, username, password);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to Stop Orbit ", 500));
        }
    }
    cleanBalloon = async (req, res) => {
        const { host, sshPort, username, password } = req.body;
        try {
            const response = await cleanBalloonService(host, sshPort, username, password);
            return res.status(200).json(response);
        } catch (error) {
            return next(new AppError(error || "Failed to Clean Balloon ", 500));
        }

    }
}
