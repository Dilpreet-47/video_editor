import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 1. Define target based ONLY on the current file being processed
    const targetDir = file.fieldname === "audio" 
      ? "./public/Uploads/Audios" 
      : "./public/Uploads/Videos";

    try {
      // 2. Ensure folder exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 3. Cleanup: Clear ONLY the specific folder for this file type
      const files = fs.readdirSync(targetDir);
      for (const existingFile of files) {
        const filePath = path.join(targetDir, existingFile);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      console.log(`Cleared previous files in: ${targetDir}`);
    } catch (err) {
      console.error(`Error clearing ${targetDir}:`, err);
    }

    // 4. Use the locally scoped targetDir
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
});