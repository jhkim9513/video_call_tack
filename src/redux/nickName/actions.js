import { createAction } from "@reduxjs/toolkit";

export const setNickName = createAction("nickName/SET");
export const inputNickName = createAction("nickName/INPUT");

// setNickName() === {type: "SET", payload: undefined}
