import { createAction } from "@reduxjs/toolkit";

export const setNickName = createAction("SET");

// setNickName() === {type: "SET", payload: undefined}
