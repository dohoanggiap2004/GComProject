import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer.jsx';
import workspaceReducer from "./workspaceReducer.jsx";
import boardReducer from "./boardReducer.jsx";
import cardReducer from "./cardReducer.jsx";
import userReducer from "./userReducer.jsx";
import attachmentReducer from "./attachmentReducer.jsx";
import statisticReducer from "./statisticReducer.jsx";
import messageReducer from "./messageReducer.jsx";
import historyviewReducer from "./historyviewReducer.jsx";

// Kết hợp các reducer
const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
  board: boardReducer,
  card: cardReducer,
  user: userReducer,
  attachment: attachmentReducer,
  statistic: statisticReducer,
  message: messageReducer,
  history: historyviewReducer
});

export default rootReducer;
