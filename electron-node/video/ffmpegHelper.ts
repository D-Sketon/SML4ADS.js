import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import process from "child_process";

function findVideoInfo(reg: RegExp, text: string) {
  let matchArr = reg.exec(text);
  let infoFound;
  if (matchArr && matchArr.length > 1) {
    infoFound = matchArr[1].trim();
  }
  return infoFound;
}

function transformDuration(duration: string) {
  if (!duration) {
    return 0;
  }
  let arr = duration.split(":");
  if (arr.length === 3) {
    return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
  }
  return 0;
}

const videoSupport = function (videoPath: string) {
  return new Promise((resolve, reject) => {
    let command = `${ffmpegPath} -i ${videoPath}`;
    process.exec(
      command,
      { encoding: "utf-8" },
      function (error, stdout, stderr) {
        if (error) {
          let str = error.stack!;
          let videoReg = /Video:((\w|\s)+)/gi;
          let videoCodec = findVideoInfo(videoReg, str);
          let audioReg = /Audio:((\w|\s)+)/gi;
          let audioCodec = findVideoInfo(audioReg, str);
          let durationReg = /Duration:((\w|:|\s)+)/gi;
          let duration = findVideoInfo(durationReg, str);
          let durationSeconds = transformDuration(duration);
          console.log(
            "videoCodec:" +
              videoCodec +
              ",audioCodec:" +
              audioCodec +
              ",duration:" +
              durationSeconds
          );
          if (!videoPath || !durationSeconds) {
            reject("err video file");
            return;
          }
          const checkResult = {
            videoCodecSupport: false,
            audioCodecSupport: false,
            duration: durationSeconds,
          };
          // mp4, webm, ogg
          if (
            videoCodec === "h264" ||
            videoCodec === "vp8" ||
            videoCodec === "theora"
          ) {
            checkResult.videoCodecSupport = true;
          }
          // aac, vorbis
          if (audioCodec === "aac" || audioCodec === "vorbis") {
            checkResult.audioCodecSupport = true;
          }
          resolve(checkResult);
          return;
        }
        reject("no video info:" + videoPath);
      }
    );
  });
};
export { videoSupport };
