import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { connectRoom, inputRoomName } from "../redux/room/action";

function Access({
  nickName,
  dispatchConnectRoom,
  roomName,
  dispatchInputRoomName,
}) {
  const onChange = (e) => {
    dispatchInputRoomName(e.target.value);
  };
  const onSubmit = () => {
    dispatchConnectRoom(roomName);
  };
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  });

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
        <button>Go</button>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Access);
