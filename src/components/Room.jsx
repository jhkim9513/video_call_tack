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

  /* ---------------------- Methods ---------------------- */
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

  /* ---------------------- Life Cycle ---------------------- */

  useEffect(() => {
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
        let myMediaStream = await navigator.mediaDevices.getUserMedia(
          deviceId ? initialConstrains : cameraConstraints
        );

        dispatchSetMyStream(myMediaStream);

        videoRef.current.srcObject = myMediaStream;

        if (!deviceId) {
          await getCameras(myMediaStream);
        }
        return myMediaStream;
      } catch (e) {
        console.log(e);
      }
    }

    getMedia().then((stream) => {
      const myPeerConnection = makeConnection(stream);
      client(roomName, myPeerConnection);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIce = (data) => {
    // candidate는 브라우저가 소통하는 방법을 알려주는것
    // peerA와 peerB가 icecandidate 이벤트로 생성한 candidate들을 서로 주고 받음
    socket.emit("ice", data.candidate, roomName);
    console.log("sent candidate");
  };

  function handleAddStream(data) {
    peersVideoRef.current.srcObject = data.stream;
  }

  const makeConnection = (myStream) => {
    // 서로 다른 사용자간의 연결을 위해 생성
    const tempMyPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          // STUN 서버는 컴퓨터가 공용 IP주소를 찾게해줌 즉, 어떤것을 request하면 인터넷에서 내가 누군지를 알려줌
          // 예를들어 다른 wi-fi환경이면 다른 네트워크이기 때문에 정상작동하지 않는데 이 때 STUN서버가 필요하다.
          // 이것은 google이 제공하는것으로 테스트에만 쓰이고 실제로는 내 소유의 STUN서버로 돌려야한다.
          // 공용주소를 알아내기위한 STUN서버
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    });

    tempMyPeerConnection.addEventListener("icecandidate", handleIce);
    tempMyPeerConnection.addEventListener("addstream", handleAddStream);

    // 양쪽 브라우저에서 카메라, 마이크 데이터 stream을 받아서 구성  통상의 addStream 대신하는 작업
    myStream.getTracks().forEach((track) => {
      tempMyPeerConnection.addTrack(track, myStream);
    });
    dispatchSetPeerConnection(tempMyPeerConnection);
    return tempMyPeerConnection;
  };

  // useEffect(() => {
  //   const script = document.createElement("script");

  //   script.type = "text/babel";
  //   script.src = "../public/js/client.js";
  //   script.async = true;

  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  /* ---------------------- Render ---------------------- */
  return (
    <div>
      <h1>
        {nickName}님 {roomName}방입니다.
      </h1>
      <div>video</div>
      <video className="myFace" ref={videoRef} autoPlay></video>

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

      <video className="peersFace" ref={peersVideoRef} autoPlay></video>
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
