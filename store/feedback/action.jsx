import { feedbackService } from "../../services/feedbackService";
import { ToastAndroid } from "react-native";
import { GetAppointmentById } from "../appointment/action";

export const CreateFeedback = (data, appointmentId) => async (dispatch) => {
  try {
    const response = await feedbackService.CreateFeedback(data);
    dispatch(GetAppointmentById(appointmentId));
    ToastAndroid.show(response.data, ToastAndroid.SHORT);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    console.log("error CreateReport", errorMessage);
  }
};
