import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/main.routes.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
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
