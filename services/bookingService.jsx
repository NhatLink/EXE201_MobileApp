import { API } from "./api";

export const BookingService = {
  GetAvailableTime(data) {
    return API.post(`/api/v1/appointments/GetAvailableTime`, data);
  },
};
