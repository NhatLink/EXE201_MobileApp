import { AppointmentService } from "../../services/appointmentService";
import { ToastAndroid } from "react-native";

export const APPOINTMENT_REQUEST = "APPOINTMENT_REQUEST";
export const APPOINTMENT_SUCCESS = "APPOINTMENT_SUCCESS";
export const APPOINTMENT_FAILURE = "APPOINTMENT_SUCCESS";

export const HISTORY_APPOINTMENT_REQUEST = "HISTORY_APPOINTMENT_REQUEST";
export const HISTORY_APPOINTMENT_SUCCESS = "HISTORY_APPOINTMENT_SUCCESS";
export const HISTORY_APPOINTMENT_FAILURE = "HISTORY_APPOINTMENT_SUCCESS";

export const CANCEL_APPOINTMENT_REQUEST = "CANCEL_APPOINTMENT_REQUEST";
export const CANCEL_APPOINTMENT_SUCCESS = "CANCEL_APPOINTMENT_SUCCESS";
export const CANCEL_APPOINTMENT_FAILURE = "CANCEL_APPOINTMENT_FAILURE";

export const APPOINTMENT_ID_REQUEST = "APPOINTMENT_ID_REQUEST";
export const APPOINTMENT_ID_SUCCESS = "APPOINTMENT_ID_SUCCESS";
export const APPOINTMENT_ID_FAILURE = "APPOINTMENT_ID_SUCCESS";

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

export const GetAppointmentById = (id) => async (dispatch) => {
  dispatch({ type: APPOINTMENT_ID_REQUEST });
  try {
    const response = await AppointmentService.getAppointmentById(id);
    dispatch({ type: APPOINTMENT_ID_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: APPOINTMENT_ID_FAILURE, payload: error.message });
    console.log("error GetAppointmentById", error);
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

export const CancelAppointmentByCustomer =
  (id, data, currentPage, itemsPerPage, accountId) => async (dispatch) => {
    dispatch({ type: CANCEL_APPOINTMENT_FAILURE });
    console.log("data CancelAppointment", data);
    try {
      const response = await AppointmentService.CancelAppointmentByCustomer(
        id,
        data
      );
      dispatch({ type: CANCEL_APPOINTMENT_SUCCESS, payload: response.data });
      dispatch(GetAppointmentByAccountId(currentPage, itemsPerPage, accountId));
      ToastAndroid.show(response.data, ToastAndroid.SHORT);
    } catch (error) {
      dispatch({ type: CANCEL_APPOINTMENT_FAILURE, payload: error.message });
      console.error("Failed to CancelAppointmentByCustomer:", error);
    }
  };
