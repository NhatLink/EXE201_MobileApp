import { reportService } from "../../services/reportService";
import { ToastAndroid } from "react-native";

// export const SEND_REPORT_REQUEST = "SEND_REPORT_REQUEST";
// export const SEND_REPORT_SUCCESS = "SEND_REPORT_SUCCESS";
// export const SEND_REPORT_FAILURE = "SEND_REPORT_FAILURE";

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
