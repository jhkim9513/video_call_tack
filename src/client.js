const io = require("socket.io");
const socket = io();

let myStream;

export const getMedia = async (deviceId, myFace) => {
  console.log(`myFace : ${myFace}`);
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstrains = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? initialConstrains : cameraConstrains
    );
    myFace.srcObject = myStream;

    console.log(`myStream : ${myStream}`);
  } catch (e) {
    console.log(e);
  }
};

export const initCall = async (videoRef) => {
  console.log("initCall!");
  await getMedia(null, videoRef);
};
