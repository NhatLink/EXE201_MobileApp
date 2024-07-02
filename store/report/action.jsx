import { reportService } from "../../services/reportService";
import { ToastAndroid } from "react-native";

export const REPORT_REQUEST = "REPORT_REQUEST";
export const REPORT_SUCCESS = "REPORT_SUCCESS";
export const REPORT_FAILURE = "REPORT_FAILURE";

export const CreateReport = (data) => async (dispatch) => {
  try {
    const response = await reportService.CreateReport(data);
    ToastAndroid.show(response.data, ToastAndroid.SHORT);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    console.log("error CreateReport", errorMessage);
  }
};
export const GetReportByCustomerId =
  (id, page, size, status) => async (dispatch) => {
    dispatch({ type: REPORT_REQUEST });
    try {
      const response = await reportService.GetReportByCustomerId(
        id,
        page,
        size,
        status
      );
      dispatch({ type: REPORT_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: REPORT_FAILURE, payload: error.message });
      console.log("error GetReportByCustomerId", error);
    }
  };
