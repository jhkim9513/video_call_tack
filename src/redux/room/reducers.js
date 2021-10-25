import { createReducer } from "@reduxjs/toolkit";
import { connectRoom, inputRoomName, setMyStream } from "./action";

const initialState = {
  roomName: "",
  hasRoom: false,
  myStream: {},
  mute: true,
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
    console.log(`action.payload : ${action.payload}`);
    console.log(`state.myStream : ${state.myStream}`);
  },
});
