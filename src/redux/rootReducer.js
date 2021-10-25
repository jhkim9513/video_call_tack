import { combineReducers } from "redux";
import { nickNameReducer } from "./nickName/reducers";
import { roomReducer } from "./room/reducers";

const rootReducer = combineReducers({
  nickNameReducer,
  roomReducer,
});

export default rootReducer;
