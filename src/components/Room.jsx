import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { setMyStream } from "../redux/room/action";

function Room({ nickName, roomName, myStream, mute, dispatchSetMyStream }) {
  const videoRef = useRef();

  useEffect(async () => {
    const myMediaStream = await getMedia();
    console.log(myMediaStream);
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
      return myMediaStream;

      //   videoRef.current.srcObject = myStream;
      //   if (!deviceId) {
      //     await getCameras();
      //   }
    } catch (e) {
      console.log(e);
    }
  }

  //   function handleMuteClick() {
  //       myStream.getAudioTracks()
  //       .forEach((track) => (track.enabled = !track.enabled));
  //       if(!muted)
  //   }

  return (
    <div>
      <h1>
        {nickName}님 {roomName}방입니다.
      </h1>
      <div>video</div>
      <video className="myFace" ref={videoRef} autoPlay></video>
      <button className="muteBtn">Mute</button>
    </div>
  );
}

const mapStateToProps = (state, props) => {
  return {
    nickName: state.nickNameReducer.nickName,
    roomName: state.roomReducer.roomName,
    myStream: state.roomReducer.myStream,
    mute: state.roomReducer.mute,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatchSetMyStream: (stream) => {
      dispatch(setMyStream(stream));
      console.log(`stream : ${stream}`);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
