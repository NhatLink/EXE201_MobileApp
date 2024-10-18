import { notificationService } from "../../services/notificationService";

export const GET_NOTIFICATION = "GET_NOTIFICATION";
export const UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION";
export const POST_NOTIFICATION = "POST_NOTIFICATION";
export const NEW_NOTIFICATION = "NEW_NOTIFICATION";

export const getNotificationList = (list) => {
  return {
    type: GET_NOTIFICATION,
    payload: list,
  };
};

export const newNotification = (boolean) => ({
  type: NEW_NOTIFICATION,
  payload: boolean,
});

export function actGetNotificationList(id, page, size) {
  return async (dispatch) => {
    const result = notificationService.getNotification(id, page, size);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(getNotificationList(response.data));
        } else {
          console.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while actGetNotificationList:", error);
      });
  };
}

export function actCreateNotificationList(id, data) {
  return async (dispatch) => {
    const result = notificationService.createNotification(id, data);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          // dispatch(actGetNotificationList(id, page, size));
          console.log("Thông báo đã được gửi thành công!!!");
        } else {
          console.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while actCreateNotificationList:", error);
      });
  };
}

export function actUpdateNotificationList(idNoti, id, page, size) {
  return async (dispatch) => {
    const result = notificationService.updateNotification(idNoti);
    await result
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(actGetNotificationList(id, page, size));
        } else {
          console.error("Lỗi lấy dữ liệu!!!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while actUpdateNotificationList:", error);
      });
  };
}
