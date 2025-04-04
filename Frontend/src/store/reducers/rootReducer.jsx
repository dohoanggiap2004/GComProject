import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer.jsx';
import workspaceReducer from "./workspaceReducer.js";
import boardReducer from "./boardReducer.js";
import cardReducer from "./cardReducer.js";
import userReducer from "./userReducer.js";

// Kết hợp các reducer
const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
  board: boardReducer,
  card: cardReducer,
  user: userReducer,
});

export default rootReducer;
