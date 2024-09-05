import { API } from "./api";

export const BookingService = {
  GetAvailableTime(data) {
    return API.post(`/api/v1/appointments/GetAvailableTime`, data);
  },
  BookAppointment(data) {
    return API.post(`/api/v1/appointments/BookAppointment`, data);
  },
  CalculatePrice(data) {
    return API.post(`/api/v1/appointments/CalculatePrice`, data);
  },
  CreateAppointment(data) {
    return API.post(`/api/v1/appointments/CreateAppointment`, data);
  },
  broadcastMessage(data) {
    return API.post(`/api/v1/signalRs/BroadcastMessage/broadcast`, data);
  },
};
