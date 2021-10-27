import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { setNickName, inputNickName } from "../redux/nickName/actions";
import { Button } from "../styledComponent/styledComponent";

function NickName({ dispatchNickName, nickName, dispatchInputNickName }) {
  const inputRef = useRef();
  const onChange = (e) => {
    dispatchInputNickName(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
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
        <Button color="red" doInput={nickName}>
          Go
        </Button>
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
    dispatchNickName: (nickName) => {
      dispatch(setNickName(nickName));
    },
    dispatchInputNickName: (text) => {
      dispatch(inputNickName(text));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NickName);
