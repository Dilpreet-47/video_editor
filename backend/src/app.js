import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/main.routes.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow OPTIONS
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.static("public/Uploads/Videos"));
app.use(express.static("public/Uploads/Audios"));
app.use(cookieParser());

app.use("/api/v1/videdit", router);

export default app;
