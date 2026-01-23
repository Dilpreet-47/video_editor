import express from "express";
import { upload } from "../middlewares/Upload.middleware.js";
import { uploadVideo } from "../controllers/Upload.controller.js";
import { trimVideo } from "../controllers/Trim.controller.js";

const router = express.Router();

router.post("/upload", upload.single("video"), uploadVideo);
router.post("/trim", upload.single("video"), trimVideo);

export default router;  