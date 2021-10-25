import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { setNickName } from "../redux/nickName/actions";

function NickName({ dispatchNickName }) {
  const [nickName, setNickName] = useState("");
  const inputRef = useRef();
  const onChange = (e) => {
    setNickName(e.target.value);
  };
  const onSubmit = () => {
    dispatchNickName(nickName);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <h1>닉네임을 입력해주세요</h1>
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={nickName}
          onChange={onChange}
        />
        <button>Go</button>
      </form>
    </div>
  );
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatchNickName: (nickName) => {
      dispatch(setNickName(nickName));
    },
  };
};

export default connect(null, mapDispatchToProps)(NickName);
