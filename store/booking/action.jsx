import { BookingService } from "../../services/bookingService";
import { ToastAndroid } from "react-native";

export const GET_AVAILABLE_TIME_REQUEST = "GET_AVAILABLE_TIME_REQUEST";
export const GET_AVAILABLE_TIME_SUCCESS = "GET_AVAILABLE_TIME_SUCCESS";
export const GET_AVAILABLE_TIME_FAILURE = "GET_AVAILABLE_TIME_FAILURE";

// Gửi OTP email action
export const GetAvailableTime = (data) => async (dispatch) => {
  dispatch({ type: GET_AVAILABLE_TIME_REQUEST });
  console.log("GetAvailableTime data:", data);
  try {
    const response = await BookingService.GetAvailableTime(data);
    dispatch({ type: GET_AVAILABLE_TIME_SUCCESS, payload: response.data });
    // ToastAndroid.show(response.data, ToastAndroid.SHORT);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: GET_AVAILABLE_TIME_FAILURE, payload: errorMessage });
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    console.log("error GetAvailableTime", error);
  }
};
