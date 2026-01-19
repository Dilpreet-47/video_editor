import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiRes } from "../utils/ApiRes.js";

const uploadVideo = asyncHandler(async (req, res) => {
    const videoFileLocalPath = req.file?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    const videoData = {
        filename: req.file.filename,
        path: videoFileLocalPath,
        size: req.file.size,
        mimetype: req.file.mimetype
    };
    
    

    return res
        .status(200)
        .json(
            new ApiRes(
                200,
                videoData,
                "Video uploaded successfully to local storage"
            )
        );
});

export { uploadVideo };