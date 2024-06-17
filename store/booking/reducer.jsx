import {
  GET_AVAILABLE_TIME_FAILURE,
  GET_AVAILABLE_TIME_SUCCESS,
  GET_AVAILABLE_TIME_REQUEST,
} from "./action";

const initialState = {
  loading: false,
  availableTime: [],
  error: null,
};

const bookingServiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AVAILABLE_TIME_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_AVAILABLE_TIME_SUCCESS:
      return {
        ...state,
        loading: false,
        availableTime: action.payload.availableTimes,
        error: null,
      };
    case GET_AVAILABLE_TIME_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        availableTime: [],
      };
    default:
      return state;
  }
};

export default bookingServiceReducer;
