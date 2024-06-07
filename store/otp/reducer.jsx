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
  RESET_OTP,
} from "./action";

const initialState = {
  loading: false,
  CheckOtp: false,
  error: null,
  emailExists: false,
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
      return {
        ...state,
        loading: false,
        error: null,
      };
    case CHECK_OTP_SUCCESS:
      return {
        ...state,
        CheckOtp: true,
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
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CHECK_OTP_FAILURE:
      return {
        ...state,
        CheckOtp: false,
        loading: false,
        error: action.payload,
      };
    case RESET_OTP:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default otpReducer;
