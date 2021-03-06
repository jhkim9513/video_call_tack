import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  connectRoom,
  inputRoomName,
  setMyStream,
  setPeerConnection,
} from "../redux/room/action";
import { Button } from "../styledComponent/styledComponent";

function Access({
  nickName,
  dispatchConnectRoom,
  roomName,
  dispatchInputRoomName,
  dispatchSetPeerConnection,
  dispatchSetMyStream,
}) {
  const inputRef = useRef();
  /* ---------------------- Methods ---------------------- */
  const onChange = (e) => {
    dispatchInputRoomName(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    dispatchConnectRoom(roomName);
  };
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

    // 양쪽 브라우저에서 카메라, 마이크 데이터 stream을 받아서 구성  통상의 addStream 대신하는 작업
    myStream.getTracks().forEach((track) => {
      tempMyPeerConnection.addTrack(track, myStream);
    });
    dispatchSetPeerConnection(tempMyPeerConnection);
  };

  /* ---------------------- Life Cycle ---------------------- */

  useEffect(() => {
    inputRef.current.focus();
  });

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

        // videoRef.current.srcObject = myMediaStream;

        // if (!deviceId) {
        //   await getCameras(myMediaStream);
        // }
        return myMediaStream;
      } catch (e) {
        console.log(e);
      }
    }

    getMedia().then((stream) => {
      makeConnection(stream);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------- Render ---------------------- */
  return (
    <div>
      <h1>{nickName}님! 방의 이름을 입력해주세요</h1>
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={roomName}
          onChange={onChange}
        />
        <Button color="red" doInput={roomName}>
          Go
        </Button>
      </form>
    </div>
  );
}

const mapStateToProps = (state, props) => {
  return {
    nickName: state.nickNameReducer.nickName,
    roomName: state.roomReducer.roomName,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatchConnectRoom: (roomName) => dispatch(connectRoom(roomName)),
    dispatchInputRoomName: (text) => dispatch(inputRoomName(text)),
    dispatchSetPeerConnection: (peerConnection) => {
      dispatch(setPeerConnection(peerConnection));
    },
    dispatchSetMyStream: (stream) => {
      dispatch(setMyStream(stream));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Access);
