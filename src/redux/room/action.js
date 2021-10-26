import { createAction } from "@reduxjs/toolkit";

export const connectRoom = createAction("room/CONNECT");
export const inputRoomName = createAction("room/INPUT");
export const setMyStream = createAction("room/SETMYSTREAM");
export const clickMute = createAction("room/CLICKMUTE");
export const clickCamera = createAction("room/CLICKCAMERA");
export const setPeerConnection = createAction("room/SETPEERCONNECTION");
export const fetchMyStream = createAction("room/FETCHMYSTREAM");
export const setOffer = createAction("room/SETOFFER");
export const setAnswer = createAction("room/SETANSWER");
