import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import http from "http";
ffmpeg.setFfmpegPath(ffmpegPath);

function getParam(url: string, key: string) {
  const param = {};
  let item = [];
  const urlList = url.split("?");
  let req;
  if (urlList.length === 1) {
    req = urlList[0];
  } else {
    req = urlList[1];
  }
  const list = req.split("&");
  for (let i = 0; i < list.length; i++) {
    item = list[i].split("=");
    param[item[0]] = item[1];
  }
  return param[key] ? param[key] : null;
}

export default class VideoServer {
  _videoServer;
  _videoSourceInfo;
  _ffmpegCommand;

  set videoSourceInfo(info) {
    this._videoSourceInfo = info;
  }

  get videoSourceInfo() {
    return this._videoSourceInfo;
  }

  killFfmpegCommand() {
    if (this._ffmpegCommand) {
      this._ffmpegCommand.kill();
    }
  }

  createServer() {
    if (!this._videoServer && this.videoSourceInfo) {
      this._videoServer = http
        .createServer((request, response) => {
          console.log("on request", request.url);
          var startTime = parseInt(getParam(request.url!, "startTime"));
          let videoCodec = this.videoSourceInfo.checkResult.videoCodecSupport
            ? "copy"
            : "libx264";
          let audioCodec = this.videoSourceInfo.checkResult.audioCodecSupport
            ? "copy"
            : "aac";
          this.killFfmpegCommand();
          this._ffmpegCommand = ffmpeg()
            .input(this.videoSourceInfo.videoSourcePath)
            .nativeFramerate()
            .videoCodec(videoCodec)
            .audioCodec(audioCodec)
            .format("mp4")
            .seekInput(startTime)
            .outputOptions(
              "-movflags",
              "frag_keyframe+empty_moov+faststart",
              "-g",
              "18"
            )
            .on("progress", function (progress) {
              console.log("time: " + progress.timemark);
            })
            .on("error", function (err) {
              console.log("An error occurred: " + err.message);
            })
            .on("end", function () {
              console.log("Processing finished !");
            });
          let videoStream = this._ffmpegCommand.pipe();
          videoStream.pipe(response);
        })
        .listen(8888);
    }
  }
}
