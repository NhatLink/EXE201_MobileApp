import { AppointmentService } from "../../services/appointmentService";
import { ToastAndroid } from "react-native";

export const APPOINTMENT_REQUEST = "APPOINTMENT_REQUEST";
export const APPOINTMENT_SUCCESS = "APPOINTMENT_SUCCESS";
export const APPOINTMENT_FAILURE = "APPOINTMENT_SUCCESS";
export const RESET_OTP = "RESET_OTP";
// Gửi OTP email action
export const GetAppointmentByAccountId =
  (page, size, accountId) => async (dispatch) => {
    dispatch({ type: APPOINTMENT_REQUEST });
    try {
      const response = await AppointmentService.GetAppointmentByAccountId(
        page,
        size,
        accountId
      );
      dispatch({ type: APPOINTMENT_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: APPOINTMENT_FAILURE, payload: error.message });
    }
  };
