import express from "express";
import { upload } from "../middlewares/Upload.middleware.js";
import { uploadVideo } from "../controllers/Upload.controller.js";
import { trimVideo } from "../controllers/Trim.controller.js";
import { exportVideo } from "../controllers/Export.controller.js";

const router = express.Router();

router.post("/upload", upload.fields([
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 }
]), uploadVideo);

router.post("/trim",  trimVideo);
router.post("/export", exportVideo);

export default router;