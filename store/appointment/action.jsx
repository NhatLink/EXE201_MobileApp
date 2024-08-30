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
export const APPOINTMENT_ID_RESET = "APPOINTMENT_ID_RESET";
export const FEEDBACK_APPOINTMENT_ID_SUCCESS =
  "FEEDBACK_APPOINTMENT_ID_SUCCESS";
export const FEEDBACK_APPOINTMENT_ID_FAILURE =
  "FEEDBACK_APPOINTMENT_ID_FAILURE";

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
    dispatch(GetFeedBackByAppointmentId(id));
    dispatch({ type: APPOINTMENT_ID_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: APPOINTMENT_ID_FAILURE, payload: error.message });
    console.log("error GetAppointmentById", error);
  }
};

export const GetFeedBackByAppointmentId = (id) => async (dispatch) => {
  try {
    const response = await AppointmentService.GetFeedBackByAppointmentId(id);
    dispatch({ type: FEEDBACK_APPOINTMENT_ID_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FEEDBACK_APPOINTMENT_ID_FAILURE, payload: error.message });
    console.log("error GetFeedBackByAppointmentId", error);
  }
};

export const GetAppointmentByHistoryCustomerId =
  (page, size, customerId, status) => async (dispatch) => {
    dispatch({ type: HISTORY_APPOINTMENT_REQUEST });
    try {
      const response = await AppointmentService.HistoryAppointmentByCustomerId(
        page,
        size,
        customerId,
        status
      );
      dispatch({ type: HISTORY_APPOINTMENT_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: HISTORY_APPOINTMENT_FAILURE, payload: error.message });
    }
  };

export const CancelAppointmentByCustomer =
  (id, data, currentPage, itemsPerPage, accountId, navigation) =>
  async (dispatch) => {
    dispatch({ type: CANCEL_APPOINTMENT_REQUEST });
    // console.log("data CancelAppointment", data);
    // console.log("id CancelAppointment", id);
    try {
      const response = await AppointmentService.CancelAppointmentByCustomer(
        id,
        data
      );
      dispatch(GetAppointmentByAccountId(currentPage, itemsPerPage, accountId));
      dispatch(GetAppointmentById(id));
      dispatch({ type: CANCEL_APPOINTMENT_SUCCESS, payload: response.data });
      ToastAndroid.show(response.data, ToastAndroid.SHORT);
      // navigation.navigate("Appointment schedule");
    } catch (error) {
      dispatch({ type: CANCEL_APPOINTMENT_FAILURE, payload: error.message });
      const errorMessage = error.response?.data?.message || error.message;
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    }
  };
export const resetAppointment = () => ({
  type: APPOINTMENT_ID_RESET,
});
