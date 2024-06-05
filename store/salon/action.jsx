import { SalonInfomationService } from "../../services/salonInfomationService";
export const ACT_SALON_INFORMATION = "ACT_SALON_INFORMATION";
export const ACT_SALON_INFORMATION_BY_ID = "ACT_SALON_INFORMATION_BY_ID";
export function actSalonInformation(list) {
  return {
    type: ACT_SALON_INFORMATION,
    payload: list,
  };
}
export function actSalonInformationById(detail) {
  return {
    type: ACT_SALON_INFORMATION_BY_ID,
    payload: detail,
  };
}
export function fetchSalonInformation(page, size) {
  return async (dispatch) => {
    try {
      const response = await SalonInfomationService.getAllSalon(page, size);
      dispatch(actSalonInformation(response.data)); // Giả sử response.data là danh sách salon
    } catch (error) {
      console.error("Failed to fetch salon information:", error);
    }
  };
}
export function fetchSalonInformationById(id) {
  return async (dispatch) => {
    try {
      const response = await SalonInfomationService.getSalonById(id);
      dispatch(actSalonInformationById(response.data));
    } catch (error) {
      console.error(error);
    }
  };
}
