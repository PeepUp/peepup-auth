import { Router } from "express";
import UploadController from "../controllers/upload.controller";

const uploadRouter: Router = Router();
const uploadController = new UploadController();

uploadRouter.post("/", uploadController.store);
export { uploadRouter };
