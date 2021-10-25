import React from "react";
import { connect } from "react-redux";
import NickName from "./NickName";
import Access from "./Access";
import Room from "./Room";

function Main({ hasNickName, hasRoom }) {
  return (
    <>
      {!hasNickName && <NickName />}
      {hasNickName && !hasRoom && <Access />}
      {hasNickName && hasRoom && <Room />}
    </>
  );
}

const mapStateToProps = (state, props) => {
  return {
    hasNickName: state.nickNameReducer.hasNickName,
    hasRoom: state.roomReducer.hasRoom,
  };
};

export default connect(mapStateToProps)(Main);
