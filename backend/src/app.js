import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/main.routes.js";
import path from "path";
import { fileURLToPath } from 'url'; // Add this

// --- ES MODULE FIX ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ---------------------

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static Folders
app.use(express.static("public"));

// PROPER STATIC PATH DEFINITION
// This tells Express: When someone visits /uploads, look in public/uploads/trimmed
// app.use('/Uploads', express.static(path.join(__dirname, 'public/Uploads/Trimmed')));
app.use('/Uploads', express.static(path.join(__dirname, 'public/Uploads/Trimmed'), {
    setHeaders: (res) => {
        res.set('Access-Control-Allow-Origin', '*'); // Relaxes security for the media resource
        res.set('Accept-Ranges', 'bytes');          // Crucial for video streaming
    }
}));
app.use(cookieParser());
app.use("/api/v1/videdit", router);

export default app;