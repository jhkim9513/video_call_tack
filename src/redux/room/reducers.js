import { createReducer } from "@reduxjs/toolkit";
import { connectRoom } from "./action";

const initialState = { roomName: "", hasRoom: false };

export const roomReducer = createReducer(initialState, {
  [connectRoom]: (state, action) => {
    state.roomName = action.payload;
    state.hasRoom = true;
  },
});
