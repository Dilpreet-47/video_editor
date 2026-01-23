import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

// Tell fluent-ffmpeg where the installer put the binary
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

console.log("FFmpeg Path:", ffmpegInstaller.path);

ffmpeg.getAvailableCodecs((err, codecs) => {
    if (err) {
        console.error("Error finding FFmpeg:", err);
    } else {
        console.log("FFmpeg is ready! Found", Object.keys(codecs).length, "codecs.");
    }
});