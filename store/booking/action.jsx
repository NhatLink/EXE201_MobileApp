import { BookingService } from "../../services/bookingService";
import { ToastAndroid } from "react-native";
import { GetAppointmentByAccountId } from "../appointment/action";
import * as Notifications from "expo-notifications";
import { COLORS } from "../../constants";

export const GET_AVAILABLE_TIME_REQUEST = "GET_AVAILABLE_TIME_REQUEST";
export const GET_AVAILABLE_TIME_SUCCESS = "GET_AVAILABLE_TIME_SUCCESS";
export const GET_AVAILABLE_TIME_FAILURE = "GET_AVAILABLE_TIME_FAILURE";

export const BOOK_APPOINMENT_REQUEST = "BOOK_APPOINMENT_REQUEST";
export const BOOK_APPOINMENT_SUCCESS = "BOOK_APPOINMENT_SUCCESS";
export const BOOK_APPOINMENT_FAILURE = "BOOK_APPOINMENT_FAILURE";

export const CACULATE_PRICE_REQUEST = "CACULATE_PRICE_REQUEST";
export const CACULATE_PRICE_SUCCESS = "CACULATE_PRICE_SUCCESS";
export const CACULATE_PRICE_FAILURE = "CACULATE_PRICE_FAILURE";

export const CREATE_APPOINTMENT_REQUEST = "CREATE_APPOINTMENT_REQUEST";
export const CREATE_APPOINTMENT_SUCCESS = "CREATE_APPOINTMENT_SUCCESS";
export const CREATE_APPOINTMENT_FAILURE = "CREATE_APPOINTMENT_FAILURE";

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
    // ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    console.log("error CalculatePrice", error);
  }
};

// export const CreateAppointment =
//   (data, navigation, currentPage, itemsPerPage, accountId) =>
//   async (dispatch) => {
//     dispatch({ type: CREATE_APPOINTMENT_REQUEST });
//     console.log("CreateAppointment data:", data);
//     console.log("CreateAppointment data:", accountId);
//     try {
//       const response = await BookingService.CreateAppointment(data);
//       ToastAndroid.show(response.data, ToastAndroid.SHORT);
//       dispatch({ type: CREATE_APPOINTMENT_SUCCESS, payload: response.data });
//       navigation.navigate("Appointment schedule");
//       dispatch(GetAppointmentByAccountId(currentPage, itemsPerPage, accountId));
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message;
//       dispatch({ type: CREATE_APPOINTMENT_FAILURE, payload: errorMessage });
//       ToastAndroid.show("Tạo lịch hẹn thất bại", ToastAndroid.SHORT);
//       console.log("error CreateAppointment", errorMessage);
//     }
//   };

export const CreateAppointment =
  (
    data,
    navigation,
    currentPage,
    itemsPerPage,
    accountId,
    scheduleNotification
  ) =>
  async (dispatch) => {
    dispatch({ type: CREATE_APPOINTMENT_REQUEST });
    console.log("CreateAppointment data:", data);
    console.log("CreateAppointment accountId:", accountId);
    try {
      const response = await BookingService.CreateAppointment(data);
      ToastAndroid.show(response.data, ToastAndroid.SHORT);
      dispatch({ type: CREATE_APPOINTMENT_SUCCESS, payload: response.data });
      navigation.navigate("Appointment schedule");
      dispatch(GetAppointmentByAccountId(currentPage, itemsPerPage, accountId));

      // Thông báo ngay lập tức khi đặt lịch thành công
      scheduleNotification({
        title: "Lịch hẹn thành công",
        body: "Lịch hẹn của bạn đã được đặt thành công.",
        triggerInSeconds: 1, // Thông báo ngay lập tức
        importance: Notifications.AndroidImportance.DEFAULT, // Mức độ quan trọng cao
        vibrationPattern: [0, 250, 250, 250], // Mẫu rung
        lightColor: COLORS.secondary, // Màu đèn sáng
      });

      // Đặt lịch thông báo trước 1 giờ
      const startTime = new Date(data.appointmentDetails[0].startTime);
      const notificationTime = new Date(startTime.getTime() - 60 * 60 * 1000); // Trừ 1 giờ

      scheduleNotification({
        title: "Nhắc nhở lịch hẹn",
        body: "Bạn có một lịch hẹn sắp tới trong 1 giờ nữa.",
        data: { appointmentId: response.data.id },
        triggerInSeconds: Math.max(
          (notificationTime.getTime() - Date.now()) / 1000,
          1
        ),
        importance: Notifications.AndroidImportance.MAX, // Đặt mức độ quan trọng cao
        vibrationPattern: [0, 250, 250, 250], // Mẫu rung
        lightColor: COLORS.secondary, // Màu đèn sáng
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: CREATE_APPOINTMENT_FAILURE, payload: errorMessage });
      ToastAndroid.show(
        "Tạo lịch hẹn thất bại, vui lòng thử lại sau !",
        ToastAndroid.SHORT
      );
      console.log("error CreateAppointment", errorMessage);
    }
  };
