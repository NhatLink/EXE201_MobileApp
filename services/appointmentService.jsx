import { API } from "./api";

export const AppointmentService = {
  GetAppointmentByAccountId(page, size, accountId) {
    return API.get(
      `/api/v1/appointments/GetAppointmentByAccountId/${accountId}`,
      {
        params: {
          page,
          size,
        },
      }
    );
  },
  HistoryAppointmentByCustomerId(page, size, customerId) {
    return API.get(
      `/api/v1/appointments/GetHistoryAppointmentByCustomterId/${customerId}`,
      {
        params: {
          page,
          size,
        },
      }
    );
  },
  CancelAppointmentByCustomer(id, data) {
    return API.put(`/api/v1/appointments/UpdateAppointment/${id}`, data);
  },
};
