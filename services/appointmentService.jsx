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
};
