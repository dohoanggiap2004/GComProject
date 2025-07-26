import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import itemReducer from "./itemReducer";
import transactionReducer from "./transactionReducer";
import userReducer from "./userReducer";
import dashboardReducer from "./dashboardReducer";


// Kết hợp các reducer
const rootReducer = combineReducers({
  auth: authReducer,
  item: itemReducer,
  transaction: transactionReducer,
  user: userReducer,
  dashboard: dashboardReducer,

});

export default rootReducer;
