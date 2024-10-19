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
    console.log("error CreateReport", error);
    console.log("error CreateReport", errorMessage);
  }
};

export const handleDeleteFeedback =
  (feedbackId, appointmentId) => async (dispatch) => {
    try {
      const response = await feedbackService.DeleteFeedback(feedbackId);
      dispatch(GetAppointmentById(appointmentId));
      ToastAndroid.show("Xóa nhận xét thành công", ToastAndroid.SHORT);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      console.log("error handleDeleteFeedback", error);
    }
  };
