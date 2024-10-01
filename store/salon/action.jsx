import { ToastAndroid } from "react-native";
import { SalonInfomationService } from "../../services/salonInfomationService";
export const ACT_SALON_INFORMATION = "ACT_SALON_INFORMATION";
// export const ACT_SALON_INFORMATION_BY_ID = "ACT_SALON_INFORMATION_BY_ID";
export const GET_SALON_EMPPLOYEE_BY_SALON_ID =
  "GET_SALON_EMPPLOYEE_BY_SALON_ID";
export const GET_SALON_SERVICE_BY_SALON_ID = "GET_SALON_SERVICE_BY_SALON_ID";
export const GET_SALON_FEEDBACK_BY_SALON_ID = "GET_SALON_FEEDBACK_BY_SALON_ID";
export const SEARCH_SALON_INFORMATION = "SEARCH_SALON_INFORMATION";

export const ACT_SALON_INFORMATION_BY_ID_REQUEST =
  "ACT_SALON_INFORMATION_BY_ID_REQUEST";
export const ACT_SALON_INFORMATION_BY_ID_SUCCESS =
  "ACT_SALON_INFORMATION_BY_ID_SUCCESS";
export const ACT_SALON_INFORMATION_BY_ID_FAILURE =
  "ACT_SALON_INFORMATION_BY_ID_FAILURE";

export function actSalonInformation(list) {
  return {
    type: ACT_SALON_INFORMATION,
    payload: list,
  };
}
// export function actSalonInformationById(detail) {
//   return {
//     type: ACT_SALON_INFORMATION_BY_ID,
//     payload: detail,
//   };
// }
// export function GetSalonEmployeeBySalonInformationId(list) {
//   return {
//     type: GET_SALON_EMPPLOYEE_BY_SALON_ID,
//     payload: list,
//   };
// }
// export function GetServiceHairBySalonInformationId(list) {
//   return {
//     type: GET_SALON_SERVICE_BY_SALON_ID,
//     payload: list,
//   };
// }
export function fetchSalonInformation() {
  return async (dispatch) => {
    try {
      const response = await SalonInfomationService.GetSalonSuggestion();
      dispatch(actSalonInformation(response.data)); // Giả sử response.data là danh sách salon
    } catch (error) {
      console.error("Failed to fetch salon information:", error);
    }
  };
}
export function searchSalonInformation(
  serviceName,
  salonAddress,
  salonName,
  page,
  size,
  latitude,
  longtitude
) {
  return async (dispatch) => {
    try {
      const response = await SalonInfomationService.searchSalon(
        serviceName,
        salonAddress,
        salonName,
        page,
        size,
        latitude,
        longtitude,
        10
      );
      dispatch({
        type: SEARCH_SALON_INFORMATION,
        payload: response.data,
      });
    } catch (error) {
      console.error("Failed to search salon information:", error);
    }
  };
}
// export function fetchSalonInformationById(id) {
//   return async (dispatch) => {
//     try {
//       const response = await SalonInfomationService.getSalonById(id);
//       dispatch(actSalonInformationById(response.data));
//       dispatch(fetchSalonEmployeeBySalonInformationId(id));
//       dispatch(fetchServiceHairBySalonInformationId(id));
//       dispatch(fetchFeedbackBySalonInformationId(id, 1, 3));
//     } catch (error) {
//       console.error("Failed to fetch SalonInformation By Id:", error);
//     }
//   };
// }

export const fetchSalonInformationById = (id) => async (dispatch) => {
  dispatch({ type: ACT_SALON_INFORMATION_BY_ID_REQUEST });
  try {
    const response = await SalonInfomationService.getSalonById(id);
    // dispatch(fetchSalonEmployeeBySalonInformationId(id, 1, 5));
    // dispatch(fetchServiceHairBySalonInformationId(id, 1, 3));
    // dispatch(fetchFeedbackBySalonInformationId(id, 1, 5));
    dispatch({
      type: ACT_SALON_INFORMATION_BY_ID_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({
      type: ACT_SALON_INFORMATION_BY_ID_FAILURE,
      payload: errorMessage,
    });
    ToastAndroid.show(
      "Có lỗi khi lấy thông tin salon/barber",
      ToastAndroid.SHORT
    );
    console.log("error fetchSalonInformationById", errorMessage);
  }
};

export function fetchSalonEmployeeBySalonInformationId(
  id,
  page,
  size,
  nameEmployee
) {
  return async (dispatch) => {
    try {
      const response =
        await SalonInfomationService.GetSalonEmployeeBySalonInformationId(
          id,
          page,
          size,
          nameEmployee
        );
      dispatch({
        type: GET_SALON_EMPPLOYEE_BY_SALON_ID,
        payload: response.data,
      });
    } catch (error) {
      console.error(
        "Failed to fetch SalonEmployee By SalonInformationId:",
        error
      );
    }
  };
}
export function fetchServiceHairBySalonInformationId(id, page, size, search) {
  return async (dispatch) => {
    try {
      const response =
        await SalonInfomationService.GetServiceHairBySalonInformationId(
          id,
          page,
          size,
          search
        );
      dispatch({ type: GET_SALON_SERVICE_BY_SALON_ID, payload: response.data });
    } catch (error) {
      console.error(
        "Failed to fetch ServiceHair By SalonInformationId:",
        error
      );
    }
  };
}
export function fetchFeedbackBySalonInformationId(id, page, size, rating) {
  return async (dispatch) => {
    try {
      const response = await SalonInfomationService.GetFeedBackBySalonId(
        id,
        page,
        size,
        rating
      );
      dispatch({
        type: GET_SALON_FEEDBACK_BY_SALON_ID,
        payload: response.data,
      });
    } catch (error) {
      console.error("Failed to fetch Feedback By SalonInformationId:", error);
    }
  };
}
