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

  GetSalonSuggestion() {
    return API.get(`/api/v1/saloninformations/GetSalonSuggestion`);
  },

  searchSalon(
    serviceName,
    salonAddress,
    salonName,
    page,
    size,
    latitude,
    longtitude,
    distance
  ) {
    return API.get(`/api/v1/saloninformations/GetSalonByServiceNameAddress`, {
      params: {
        serviceName,
        salonAddress,
        salonName,
        page,
        size,
        latitude,
        longtitude,
        distance,
      },
    });
  },
  getSalonById(id) {
    return API.get(`/api/v1/saloninformations/GetSalonInformationById/${id}`);
  },
  GetSalonEmployeeBySalonInformationId(id, page, size, nameEmployee) {
    return API.get(
      `/api/v1/salonemployees/GetSalonEmployeeBySalonInformationId/${id}`,
      {
        params: {
          page,
          size,
          nameEmployee,
        },
      }
    );
  },
  GetServiceHairBySalonInformationId(id, page, size, search) {
    return API.get(`/api/v1/servicehairs/GetServiceHairBySalonIdPaging/${id}`, {
      params: {
        page,
        size,
        search,
      },
    });
  },
  GetFeedBackBySalonId(id, page, size, rating) {
    return API.get(`/api/v1/feedbacks/GetFeedBackBySalonId/${id}`, {
      params: {
        page,
        size,
        rating,
      },
    });
  },
};
