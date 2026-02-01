import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiRes } from "../utils/ApiRes.js";

export const uploadVideo = asyncHandler(async (req, res) => {
    // Accessing fields by name
    const video = req.files?.video?.[0];
    const audio = req.files?.audio?.[0];

    if (!video) throw new ApiError(400, "Video is required");

    // Return both paths so React can use them
    return res.status(200).json(
        new ApiRes(200, {
            videoData: { path: video.path, name: video.filename },
            audioData: audio ? { path: audio.path, name: audio.filename } : null
        }, "Upload successful")
    );
});