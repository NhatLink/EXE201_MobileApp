import { AppointmentService } from "../../services/appointmentService";
import { ToastAndroid } from "react-native";

export const APPOINTMENT_REQUEST = "APPOINTMENT_REQUEST";
export const APPOINTMENT_SUCCESS = "APPOINTMENT_SUCCESS";
export const APPOINTMENT_FAILURE = "APPOINTMENT_SUCCESS";
export const HISTORY_APPOINTMENT_REQUEST = "HISTORY_APPOINTMENT_REQUEST";
export const HISTORY_APPOINTMENT_SUCCESS = "HISTORY_APPOINTMENT_SUCCESS";
export const HISTORY_APPOINTMENT_FAILURE = "HISTORY_APPOINTMENT_SUCCESS";

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
      console.log("error GetAppointmentByAccountId", error);
    }
  };

export const GetAppointmentByHistoryCustomerId =
  (page, size, customerId) => async (dispatch) => {
    dispatch({ type: HISTORY_APPOINTMENT_REQUEST });
    try {
      const response = await AppointmentService.HistoryAppointmentByCustomerId(
        page,
        size,
        customerId
      );
      dispatch({ type: HISTORY_APPOINTMENT_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: HISTORY_APPOINTMENT_FAILURE, payload: error.message });
    }
  };
