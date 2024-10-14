import { voucherService } from "../../services/voucherService";
import { ToastAndroid } from "react-native";

export const GET_VOUCHER_ID_REQUEST = "GET_VOUCHER_ID_REQUEST";
export const GET_VOUCHER_ID_SUCCESS = "GET_VOUCHER_ID_SUCCESS";
export const GET_VOUCHER_ID_FAILURE = "GET_VOUCHER_ID_FAILURE";

export const GetVoucherBySalonId = (salonId) => async (dispatch) => {
  dispatch({ type: GET_VOUCHER_ID_REQUEST });
  try {
    const response = await voucherService.GetVoucherBySalonId(salonId);
    // console.log("GetVoucherBySalonId response:", response.data);
    dispatch({ type: GET_VOUCHER_ID_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: GET_VOUCHER_ID_FAILURE, payload: errorMessage });
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    console.log("error GetVoucherBySalonId", errorMessage);
  }
};
