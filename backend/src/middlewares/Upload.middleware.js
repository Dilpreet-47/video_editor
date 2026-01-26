import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "./public/Uploads/Videos";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            if (fs.existsSync(uploadDir)) {
                const files = fs.readdirSync(uploadDir);
                for (const existingFile of files) {
                    // This deletes every file in the folder before saving the new one
                    fs.unlinkSync(path.join(uploadDir, existingFile));
                }
                console.log("Old videos cleared from storage.");
            }
        } catch (err) {
            console.error("Error clearing old files:", err);
        }
        cb(null, uploadDir);
    },  
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({ 
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }
});