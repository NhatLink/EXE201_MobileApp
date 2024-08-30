import { otpServices } from "../../services/otpServices";
import { ToastAndroid } from "react-native";

export const SEND_OTP_EMAIL_REQUEST = "SEND_OTP_EMAIL_REQUEST";
export const SEND_OTP_EMAIL_SUCCESS = "SEND_OTP_EMAIL_SUCCESS";
export const SEND_OTP_EMAIL_FAILURE = "SEND_OTP_EMAIL_FAILURE";

export const CHECK_OTP_REQUEST = "CHECK_OTP_REQUEST";
export const CHECK_OTP_SUCCESS = "CHECK_OTP_SUCCESS";
export const CHECK_OTP_FAILURE = "CHECK_OTP_FAILURE";

export const CHECK_EXIST_EMAIL_REQUEST = "CHECK_EXIST_EMAIL_REQUEST";
export const CHECK_EXIST_EMAIL_SUCCESS = "CHECK_EXIST_EMAIL_SUCCESS";
export const CHECK_EXIST_EMAIL_FAILURE = "CHECK_EXIST_EMAIL_FAILURE";
export const RESET_OTP = "RESET_OTP";
// Gửi OTP email action
export const sendOtpEmail = (data) => async (dispatch) => {
  dispatch({ type: SEND_OTP_EMAIL_REQUEST });
  try {
    const response = await otpServices.sendOtp(data);
    dispatch({ type: SEND_OTP_EMAIL_SUCCESS, payload: response.data });
    ToastAndroid.show(response.data, ToastAndroid.SHORT);
  } catch (error) {
    dispatch({ type: SEND_OTP_EMAIL_FAILURE, payload: error.message });
    ToastAndroid.show(error.message, ToastAndroid.SHORT);
  }
};

// Kiểm tra OTP action
export const checkOtp = (data) => async (dispatch) => {
  dispatch({ type: CHECK_OTP_REQUEST });
  try {
    const response = await otpServices.checkOtp(data);
    dispatch({ type: CHECK_OTP_SUCCESS, payload: response.data });
    ToastAndroid.show(response.data, ToastAndroid.SHORT);
  } catch (error) {
    dispatch({ type: CHECK_OTP_FAILURE, payload: error.message });
    const errorMessage = error.response?.data?.message || error.message;
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
  }
};

// Kiểm tra email tồn tại action
export const checkExistEmail = (data, dataSend) => async (dispatch) => {
  dispatch({ type: CHECK_EXIST_EMAIL_REQUEST });
  try {
    const response = await otpServices.checkExistEmail(data);
    if (response.data === "Email hợp lệ") {
      dispatch({ type: CHECK_EXIST_EMAIL_SUCCESS, payload: response.data });
      console.log("sennd OTP");
      dispatch(sendOtpEmail(dataSend));
    }
    if (response.data === "Email đã tồn tại trên hệ thống!") {
      dispatch({ type: CHECK_EXIST_EMAIL_FAILURE, payload: response.data });
    }
    ToastAndroid.show(response.data, ToastAndroid.SHORT);
  } catch (error) {
    dispatch({ type: CHECK_EXIST_EMAIL_FAILURE, payload: error.message });
    ToastAndroid.show(error.message, ToastAndroid.SHORT);
  }
};

export const CheckNonExistEmail = (data, dataSend) => async (dispatch) => {
  dispatch({ type: CHECK_EXIST_EMAIL_REQUEST });
  try {
    const response = await otpServices.CheckNonExistEmail(data);
    if (response.data === "gửi OTP thành công") {
      dispatch({ type: CHECK_EXIST_EMAIL_SUCCESS, payload: response.data });
      console.log("sennd OTP");
      dispatch(sendOtpEmail(dataSend));
    }
    if (response.data === "Email không tồn tại trên hệ thống!") {
      dispatch({ type: CHECK_EXIST_EMAIL_FAILURE, payload: response.data });
    }
    ToastAndroid.show(response.data, ToastAndroid.SHORT);
  } catch (error) {
    dispatch({ type: CHECK_EXIST_EMAIL_FAILURE, payload: error.message });
    ToastAndroid.show(error.message, ToastAndroid.SHORT);
  }
};

export const resetCheckOtp = () => {
  return {
    type: RESET_OTP,
  };
};
