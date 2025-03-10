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
  getAppointmentById(id) {
    return API.get(`/api/v1/appointments/GetAppointmentById/${id}`);
  },
  HistoryAppointmentByCustomerId(page, size, customerId, status) {
    return API.get(
      `/api/v1/appointments/GetAppointmentCustomerByStatus/${customerId}`,
      {
        params: {
          page,
          size,
          status,
        },
      }
    );
  },
  GetFeedBackByAppointmentId(id) {
    return API.get(`/api/v1/feedbacks/GetFeedBackByAppointmentId/${id}`);
  },
  CancelAppointmentByCustomer(id, data) {
    return API.put(`/api/v1/appointments/CancelAppointByCustomer/${id}`, data);
  },
};
