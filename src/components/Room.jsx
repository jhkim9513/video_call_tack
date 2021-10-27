import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  clickCamera,
  clickMute,
  setAnswer,
  setMyStream,
  setOffer,
  setPeerConnection,
} from "../redux/room/action";
import socketIO from "socket.io-client";
import client from "../public/js/client";

function Room({
  nickName,
  roomName,
  myStream,
  mute,
  isCamera,
  peerConnection,
  offer,
  dispatchSetMyStream,
  dispatchClickMute,
  dispatchClickCamera,
  dispatchSetPeerConnection,
  dispatchSetOffer,
}) {
  const socket = socketIO("http://localhost:8080");
  const videoRef = useRef();
  const muteRef = useRef();
  const selectRef = useRef();
  const cameraRef = useRef();
  const peersVideoRef = useRef();

  // /* ---------------------- Methods ---------------------- */
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

  // /* ---------------------- Life Cycle ---------------------- */

  useEffect(() => {
    async function printStream(deviceId) {
      try {
        videoRef.current.srcObject = myStream;

        if (!deviceId) {
          await getCameras(myStream);
        }
      } catch (e) {
        console.log(e);
      }
    }

    printStream();
    // peerConnection.addEventListener("icecandidate", handleIce);
    // peerConnection.addEventListener("addstream", handleAddStream);
    // dispatchSetPeerConnection(peerConnection);
    client(roomName, peerConnection, myStream);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerConnection]);

  // const handleIce = (data) => {
  //   socket.emit("ice", data.candidate, roomName);
  //   console.log("sent candidate");
  // };

  // function handleAddStream(data) {
  //   peersVideoRef.current.srcObject = data.stream;
  // }

  /* ---------------------- Render ---------------------- */
  return (
    <div>
      <h1>
        {nickName}님 {roomName}방입니다.
      </h1>
      <div>video</div>
      <video
        className="myFace"
        ref={videoRef}
        autoPlay
        width="500px"
        height="500px"
      ></video>

      {!mute && (
        <button className="muteBtn" ref={muteRef} onClick={handleMuteClick}>
          <i className="fas fa-volume-up"></i>
        </button>
      )}
      {mute && (
        <button className="muteBtn" ref={muteRef} onClick={handleMuteClick}>
          <i className="fas fa-volume-mute"></i>
        </button>
      )}

      {!isCamera && (
        <button
          className="cameraBtn"
          ref={cameraRef}
          onClick={handleCameraClick}
        >
          <i className="fas fa-video"></i>
        </button>
      )}
      {isCamera && (
        <button
          className="cameraBtn"
          ref={cameraRef}
          onClick={handleCameraClick}
        >
          <i className="fas fa-video-slash"></i>
        </button>
      )}

      <select className="selectCamera" ref={selectRef}></select>

      <video
        className="peersFace"
        ref={peersVideoRef}
        autoPlay
        width="500px"
        height="500px"
      ></video>
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
    peerConnection: state.roomReducer.peerConnection,
    offer: state.roomReducer.offer,
    answer: state.roomReducer.answer,
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
    dispatchSetPeerConnection: (peerConnection) => {
      dispatch(setPeerConnection(peerConnection));
    },
    dispatchSetOffer: (offer) => {
      dispatch(setOffer(offer));
    },
    dispatchSetAnswer: (answer) => {
      dispatch(setAnswer(answer));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
