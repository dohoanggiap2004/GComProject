import { combineReducers } from 'redux';
import authReducer from './authReducer.jsx';
import workspaceReducer from "./workspaceReducer.js";
import boardReducer from "./boardReducer.js";

// Kết hợp các reducer
const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
  board: boardReducer
});

export default rootReducer;
