import express from "express";
import { FilesController } from "../controllers";
export const createFilesRoutes = (): express.Router => {
    const router = express.Router();
    const filesController = new FilesController();

    router.post("/upload", filesController.upload.bind(filesController));
    return router;
};
