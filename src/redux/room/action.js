import { createAction } from "@reduxjs/toolkit";

export const connectRoom = createAction("room/CONNECT");
export const inputRoomName = createAction("room/INPUT");
export const setMyStream = createAction("room/SETMYSTREAM");
export const clickMute = createAction("room/CLICKMUTE");
