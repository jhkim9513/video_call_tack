import React from "react";
import { connect } from "react-redux";
import NickName from "./NickName";
import Access from "./Access";
import Room from "./Room";
import Loading from "./Loading";

function Main({ hasNickName, hasRoom, myStream, peerConnection }) {
  return (
    <>
      {!hasNickName && <NickName />}
      {hasNickName && !hasRoom && <Access />}
      {hasNickName && hasRoom && !myStream && !peerConnection && <Loading />}
      {hasNickName && hasRoom && myStream && peerConnection && <Room />}
    </>
  );
}

const mapStateToProps = (state, props) => {
  return {
    hasNickName: state.nickNameReducer.hasNickName,
    hasRoom: state.roomReducer.hasRoom,
    myStream: state.roomReducer.myStream,
    peerConnection: state.roomReducer.peerConnection,
  };
};

export default connect(mapStateToProps)(Main);
