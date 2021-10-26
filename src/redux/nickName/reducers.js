import { createReducer } from "@reduxjs/toolkit";
import { inputNickName, setNickName } from "./actions";

const initialState = { nickName: "", hasNickName: false };

export const nickNameReducer = createReducer(initialState, {
  [setNickName]: (state, action) => {
    state.nickName = action.payload;
    state.hasNickName = true;
  },
  [inputNickName]: (state, action) => {
    state.nickName = action.payload;
  },
});
