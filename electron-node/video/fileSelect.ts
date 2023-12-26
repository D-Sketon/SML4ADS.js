import VideoServer from "./VideoServer";
import { videoSupport } from "./ffmpegHelper";

let httpServer;

async function onVideoFileSelected(
  _e: any,
  videoFilePath: string
): Promise<{
  type: string;
  videoSource: string;
  duration?: number;
}> {
  const checkResult: any = await videoSupport(videoFilePath);
  if (checkResult.videoCodecSupport && checkResult.audioCodecSupport) {
    if (httpServer) {
      httpServer.killFfmpegCommand();
    }
    const playParams = {
      type: "native",
      videoSource: videoFilePath,
    };
    return playParams;
  } else {
    if (!httpServer) {
      httpServer = new VideoServer();
    }
    httpServer.videoSourceInfo = {
      videoSourcePath: videoFilePath,
      checkResult: checkResult,
    };
    httpServer.createServer();
    console.log("createVideoServer success");
    const playParams = {
      type: "stream",
      videoSource: "http://127.0.0.1:8888?startTime=0",
      duration: checkResult.duration,
    };
    return playParams;
  }
}

export default onVideoFileSelected;
