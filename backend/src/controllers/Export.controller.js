import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportVideo = (req, res) => {
    const { fileName } = req.body; // e.g., "trimmed-12345.mp4"

    if (!fileName) {
        return res.status(400).json({ error: "Filename is required" });
    }

    // Resolve path to the Trimmed folder
    const filePath = path.resolve(__dirname, "..", "..", "public", "Uploads", "Trimmed", fileName);

    // Check if file exists before trying to download
    if (fs.existsSync(filePath)) {
        // res.download is a built-in Express helper that:
        // 1. Sets Content-Disposition to 'attachment'
        // 2. Lets you choose a "User Friendly" name for the download
        res.download(filePath, "My_Edited_Video.mp4", (err) => {
            if (err) {
                console.error("Download error:", err);
                res.status(500).send("Could not download file");
            }
        });
    } else {
        res.status(404).json({ error: "File not found on server" });
    }
};