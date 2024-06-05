import {
  SEND_OTP_EMAIL_REQUEST,
  SEND_OTP_EMAIL_SUCCESS,
  SEND_OTP_EMAIL_FAILURE,
  CHECK_OTP_REQUEST,
  CHECK_OTP_SUCCESS,
  CHECK_OTP_FAILURE,
  CHECK_EXIST_EMAIL_REQUEST,
  CHECK_EXIST_EMAIL_SUCCESS,
  CHECK_EXIST_EMAIL_FAILURE,
} from "./action";

const initialState = {
  loading: false,
  otpData: null,
  error: null,
  emailExists: true,
};

const otpReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_OTP_EMAIL_REQUEST:
    case CHECK_OTP_REQUEST:
    case CHECK_EXIST_EMAIL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SEND_OTP_EMAIL_SUCCESS:
    case CHECK_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case CHECK_EXIST_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        emailExists: true,
        error: null,
      };
    case CHECK_EXIST_EMAIL_FAILURE:
      return {
        ...state,
        loading: false,
        emailExists: false,
        error: action.payload,
      };
    case SEND_OTP_EMAIL_FAILURE:
    case CHECK_OTP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default otpReducer;
