import { SalonInfomationService } from "../../services/salonInfomationService";
export const ACT_SALON_INFORMATION = "ACT_SALON_INFORMATION";
export const ACT_SALON_INFORMATION_BY_ID = "ACT_SALON_INFORMATION_BY_ID";
export const GET_SALON_EMPPLOYEE_BY_SALON_ID =
  "GET_SALON_EMPPLOYEE_BY_SALON_ID";
export const GET_SALON_SERVICE_BY_SALON_ID = "GET_SALON_SERVICE_BY_SALON_ID";
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
      dispatch(fetchSalonEmployeeBySalonInformationId(id));
      dispatch(fetchServiceHairBySalonInformationId(id));
    } catch (error) {
      console.error("Failed to fetch SalonInformation By Id:", error);
    }
  };
}
export function fetchSalonEmployeeBySalonInformationId(id) {
  return async (dispatch) => {
    try {
      const response =
        await SalonInfomationService.GetSalonEmployeeBySalonInformationId(id);
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
export function fetchServiceHairBySalonInformationId(id) {
  return async (dispatch) => {
    try {
      const response =
        await SalonInfomationService.GetServiceHairBySalonInformationId(id);
      dispatch({ type: GET_SALON_SERVICE_BY_SALON_ID, payload: response.data });
    } catch (error) {
      console.error(
        "Failed to fetch ServiceHair By SalonInformationId:",
        error
      );
    }
  };
}
