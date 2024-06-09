import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import userReducer from "./user/reducer";
import bookingReducer from "./bookingStore/reducer";
import salonReducer from "./salon/reducer";
import otpReducer from "./otp/reducer";
import appointmentReducer from "./appointment/reducer";
const rootReducer = combineReducers({
  USER: userReducer,
  booking: bookingReducer,
  SALON: salonReducer,
  OTP: otpReducer,
  APPOINTMENT: appointmentReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
