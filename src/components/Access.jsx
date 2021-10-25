import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { connectRoom } from "../redux/room/action";

function Access({ nickName, dispatchConnectRoom }) {
  const [roomName, setRoomName] = useState("");
  const onChange = (e) => {
    setRoomName(e.target.value);
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
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatchConnectRoom: (roomName) => dispatch(connectRoom(roomName)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Access);
