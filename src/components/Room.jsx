import React from "react";
import { connect } from "react-redux";

function Room({ nickName, roomName }) {
  return (
    <div>
      <h1>
        {nickName}님 {roomName}방입니다.
      </h1>
    </div>
  );
}

const mapStateToProps = (state, props) => {
  return {
    nickName: state.nickNameReducer.nickName,
    roomName: state.roomReducer.roomName,
  };
};

export default connect(mapStateToProps)(Room);
