import { createReducer } from "@reduxjs/toolkit";
import {
  clickCamera,
  clickMute,
  connectRoom,
  inputRoomName,
  setMyStream,
} from "./action";

const initialState = {
  roomName: "",
  hasRoom: false,
  myStream: {},
  mute: false,
  isCamera: false,
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
  [clickCamera]: (state, action) => {
    state.isCamera = !state.isCamera;
  },
});
