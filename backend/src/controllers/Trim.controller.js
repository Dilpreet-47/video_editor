import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
// Define __dirname for ES Modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

// Set the path automatically using the installer
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const trimVideo = (req, res) => {
  const { filePath, startTime, endTime } = req.body;

  // 1. Validation
  if (!filePath || startTime === undefined || endTime === undefined) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const duration = endTime - startTime; 
  if (duration <= 0) {
    return res
      .status(400)
      .json({ error: "End time must be greater than start time" });
  }

  // 2. Define Output Names
  const outputDir = path.resolve(
    __dirname,
    "..",
    "..",
    "public",
    "Uploads",
    "Trimmed"
  );
  const outputName = `video-trimmed-${Date.now()}.mp4`;

  // MATCHING YOUR app.js: public/uploads/trimmed
  const outputPath = path.join(outputDir, outputName);

  try {
    if (fs.existsSync(outputDir)) {
      const files = fs.readdirSync(outputDir);
      for (const file of files) {
        fs.unlinkSync(path.join(outputDir, file));
      }
      console.log("Previous trimmed files cleared.");
    }
  } catch (err) {
    console.error("Error clearing Trimmed folder:", err);
    // We don't return res.error here so the process can still try to trim
  }
  
  // Ensure the inputPath is absolute so FFmpeg never gets lost
  const inputPath = path.resolve(filePath);

  // 3. Execution
  ffmpeg(inputPath)
    .setStartTime(startTime)
    .setDuration(duration)
    .videoCodec("libx264") // Instant: No re-encoding
    .audioCodec("aac")
    .outputOptions(["-crf 18", "-preset veryfast"])
    .on("start", (cmd) => console.log("FFmpeg Command:", cmd))
    .on("error", (err) => {
      console.error("FFmpeg Error:", err.message);
      res
        .status(500)
        .json({ error: "Trimming process failed", details: err.message });
    })
    .on("end", () => {
      console.log("Trimming complete:", outputName);
      res.status(200).json({
        success: true,
        message: "Video trimmed successfully",
        data: {
          // This matches app.use('/uploads', ...) in your app.js
          trimmedPath: `Uploads/Trimmed/${outputName}`,
          fileName: outputName,
        },
      });
    })
    .save(outputPath); // .save() is shorthand for .output().run()
};
