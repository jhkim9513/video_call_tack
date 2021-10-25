import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { clickCamera, clickMute, setMyStream } from "../redux/room/action";

function Room({
  nickName,
  roomName,
  myStream,
  mute,
  isCamera,
  dispatchSetMyStream,
  dispatchClickMute,
  dispatchClickCamera,
}) {
  const videoRef = useRef();
  const muteRef = useRef();
  const selectRef = useRef();
  const cameraRef = useRef();

  useEffect(async () => {
    const myMediaStream = await getMedia();
    dispatchSetMyStream(myMediaStream);
    videoRef.current.srcObject = myMediaStream;
  }, []);

  async function getMedia(deviceId) {
    const initialConstrains = {
      audio: true,
      video: { facingMode: "user" },
    };
    const cameraConstraints = {
      audio: true,
      video: { deviceId: { exact: deviceId } },
    };
    try {
      const myMediaStream = await navigator.mediaDevices.getUserMedia(
        deviceId ? initialConstrains : cameraConstraints
      );

      videoRef.current.srcObject = myMediaStream;

      if (!deviceId) {
        await getCameras(myMediaStream);
      }
      return myMediaStream;
    } catch (e) {
      console.log(e);
    }
  }

  async function getCameras(myStream) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");
      const currentCamera = myStream.getVideoTracks()[0];
      cameras.forEach((camera) => {
        const option = document.createElement("option");
        option.value = camera.deviceId;
        option.innerText = camera.label;
        if (currentCamera.label === camera.label) {
          option.selected = true;
        }
        selectRef.current.appendChild(option);
      });
    } catch (e) {
      console.log(e);
    }
  }

  function handleMuteClick() {
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));

    dispatchClickMute();
  }

  function handleCameraClick() {
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));

    dispatchClickCamera();
  }

  return (
    <div>
      <h1>
        {nickName}님 {roomName}방입니다.
      </h1>
      <div>video</div>
      <video className="myFace" ref={videoRef} autoPlay></video>

      {!mute && (
        <button className="muteBtn" ref={muteRef} onClick={handleMuteClick}>
          <i class="fas fa-volume-up"></i>
        </button>
      )}
      {mute && (
        <button className="muteBtn" ref={muteRef} onClick={handleMuteClick}>
          <i class="fas fa-volume-mute"></i>
        </button>
      )}

      {!isCamera && (
        <button
          className="cameraBtn"
          ref={cameraRef}
          onClick={handleCameraClick}
        >
          <i class="fas fa-video"></i>
        </button>
      )}
      {isCamera && (
        <button
          className="cameraBtn"
          ref={cameraRef}
          onClick={handleCameraClick}
        >
          <i class="fas fa-video-slash"></i>
        </button>
      )}

      <select className="selectCamera" ref={selectRef}></select>
    </div>
  );
}

const mapStateToProps = (state, props) => {
  return {
    nickName: state.nickNameReducer.nickName,
    roomName: state.roomReducer.roomName,
    myStream: state.roomReducer.myStream,
    mute: state.roomReducer.mute,
    isCamera: state.roomReducer.isCamera,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatchSetMyStream: (stream) => {
      dispatch(setMyStream(stream));
    },
    dispatchClickMute: () => {
      dispatch(clickMute());
    },
    dispatchClickCamera: () => {
      dispatch(clickCamera());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
