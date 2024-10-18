import { API } from "./api";

export const notificationService = {
  createNotification(id, data) {
    return API.post(`/api/v1/notifications/CreateNotification/${id}`, data);
  },
  getNotification(id, page, size) {
    return API.get(`/api/v1/notifications/GetNotification/${id}`, {
      params: {
        page,
        size,
      },
    });
  },
  updateNotification(id) {
    return API.put(`/api/v1/notifications/ReadedNotification/${id}`);
  },
};
