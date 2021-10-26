// import logger from "redux-logger";
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
// import { composeWithDevTools } from "redux-devtools-extension";
// import { applyMiddleware } from "redux";

const middleWare = [thunk];

const store = configureStore({ reducer: rootReducer, middleware: middleWare });

export default store;
