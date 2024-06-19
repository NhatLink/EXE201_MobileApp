import { BookingService } from "../../services/bookingService";
import { ToastAndroid } from "react-native";

export const GET_AVAILABLE_TIME_REQUEST = "GET_AVAILABLE_TIME_REQUEST";
export const GET_AVAILABLE_TIME_SUCCESS = "GET_AVAILABLE_TIME_SUCCESS";
export const GET_AVAILABLE_TIME_FAILURE = "GET_AVAILABLE_TIME_FAILURE";

export const BOOK_APPOINMENT_REQUEST = "BOOK_APPOINMENT_REQUEST";
export const BOOK_APPOINMENT_SUCCESS = "BOOK_APPOINMENT_SUCCESS";
export const BOOK_APPOINMENT_FAILURE = "BOOK_APPOINMENT_FAILURE";

export const CACULATE_PRICE_REQUEST = "CACULATE_PRICE_REQUEST";
export const CACULATE_PRICE_SUCCESS = "CACULATE_PRICE_SUCCESS";
export const CACULATE_PRICE_FAILURE = "CACULATE_PRICE_FAILURE";

export const RESET_AVAILABLE = "RESET_AVAILABLE";
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
    console.log("error GetAvailableTime", errorMessage);
  }
};

export const BookAppointment = (data) => async (dispatch) => {
  dispatch({ type: BOOK_APPOINMENT_REQUEST });
  console.log("BookAppointment data:", data);
  try {
    const response = await BookingService.BookAppointment(data);
    dispatch({ type: BOOK_APPOINMENT_SUCCESS, payload: response.data });
    // ToastAndroid.show(response.data, ToastAndroid.SHORT);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: BOOK_APPOINMENT_FAILURE, payload: errorMessage });
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    console.log("error BookAppointment", error);
  }
};

export const resetAvailable = () => ({
  type: RESET_AVAILABLE,
});

export const CalculatePrice = (data) => async (dispatch) => {
  dispatch({ type: CACULATE_PRICE_REQUEST });
  console.log("CalculatePrice data:", data);
  try {
    const response = await BookingService.CalculatePrice(data);
    dispatch({ type: CACULATE_PRICE_SUCCESS, payload: response.data });
    // ToastAndroid.show(response.data, ToastAndroid.SHORT);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: CACULATE_PRICE_FAILURE, payload: errorMessage });
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    console.log("error CalculatePrice", error);
  }
};
