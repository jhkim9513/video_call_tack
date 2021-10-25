import { createReducer } from "@reduxjs/toolkit";
import { clickMute, connectRoom, inputRoomName, setMyStream } from "./action";

const initialState = {
  roomName: "",
  hasRoom: false,
  myStream: {},
  mute: false,
};

export const roomReducer = createReducer(initialState, {
  [connectRoom]: (state, action) => {
    state.roomName = action.payload;
    state.hasRoom = true;
    // state.myStream = await getMedia();
  },
  [inputRoomName]: (state, action) => {
    state.roomName = action.payload;
  },
  [setMyStream]: (state, action) => {
    state.myStream = action.payload;
  },
  [clickMute]: (state, action) => {
    state.mute = !state.mute;
  },
});
