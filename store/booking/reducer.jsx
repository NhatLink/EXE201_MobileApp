import {
  GET_AVAILABLE_TIME_FAILURE,
  GET_AVAILABLE_TIME_SUCCESS,
  GET_AVAILABLE_TIME_REQUEST,
  BOOK_APPOINMENT_REQUEST,
  BOOK_APPOINMENT_SUCCESS,
  BOOK_APPOINMENT_FAILURE,
  RESET_AVAILABLE,
  CACULATE_PRICE_REQUEST,
  CACULATE_PRICE_FAILURE,
  CACULATE_PRICE_SUCCESS,
} from "./action";

const initialState = {
  loading: false,
  availableTime: [],
  bookAppoinment: [],
  totalPrice: null,
  error: null,
  error2: null,
};

const bookingServiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AVAILABLE_TIME_REQUEST:
    case BOOK_APPOINMENT_REQUEST:
    case CACULATE_PRICE_REQUEST:
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
    case BOOK_APPOINMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        bookAppoinment: action.payload,
        error2: null,
      };
    case BOOK_APPOINMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error2: action.payload,
        bookAppoinment: [],
      };
    case CACULATE_PRICE_SUCCESS:
      return {
        ...state,
        loading: false,
        totalPrice: action.payload,
        error2: null,
      };
    case CACULATE_PRICE_FAILURE:
      return {
        ...state,
        loading: false,
        error2: action.payload,
        totalPrice: null,
      };
    case RESET_AVAILABLE:
      return initialState;
    default:
      return state;
  }
};

export default bookingServiceReducer;
