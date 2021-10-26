import { createReducer } from "@reduxjs/toolkit";
import {
  clickCamera,
  clickMute,
  connectRoom,
  inputRoomName,
  setAnswer,
  setMyStream,
  setOffer,
  setPeerConnection,
} from "./action";

const initialState = {
  roomName: "",
  hasRoom: false,
  myStream: "",
  mute: false,
  isCamera: false,
  peerConnection: "",
  offer: "",
  answer: "",
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
  [setPeerConnection]: (state, action) => {
    state.peerConnection = action.payload;
  },
  [setOffer]: (state, action) => {
    state.offer = action.payload;
  },
  [setAnswer]: (state, action) => {
    state.answer = action.payload;
  },
});
