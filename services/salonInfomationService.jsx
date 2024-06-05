import { API } from "./api";

export const SalonInfomationService = {
  getAllSalon(page, size) {
    return API.get(`/api/v1/saloninformations/GetAllSalonInformation`, {
      params: {
        page,
        size,
      },
    });
  },
  getSalonById(id) {
    return API.get(`/api/v1/saloninformations/GetSalonInformationById/${id}`);
  },
};
