import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import userReducer from "./user/reducer";
import bookingReducer from "./bookingStore/reducer";

const rootReducer = combineReducers({
  USER: userReducer,
  booking: bookingReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
