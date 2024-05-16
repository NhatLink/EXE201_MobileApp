import { UserServices } from "../../services/userServices";
import Toast from "react-native-toast-message";
export const ACT_USER_LOGIN = "ACT_USER_LOGIN";
export const ACT_USER_NOT_FETCH_ME = "ACT_USER_NOT_FETCH_ME";
export const ALL_USER = "ALL_USER";
export const ALL_MEMBER_COUNT = "ALL_MEMBER_COUNT";
export const ALL_HOST_COUNT = "ALL_HOST_COUNT";
export const AVG_MEMBER_AUCTION = "AVG_MEMBER_AUCTION";

export function actUserLogin(currentUser, token, role) {
  return {
    type: ACT_USER_LOGIN,
    payload: {
      currentUser,
      token,
      role,
    },
  };
}
export function actUserNotFetchMe(token) {
  return {
    type: ACT_USER_NOT_FETCH_ME,
    payload: token,
  };
}
export const allUser = (list) => {
  return {
    type: ALL_USER,
    payload: list,
  };
};
export const allMember = (list) => {
  return {
    type: ALL_MEMBER_COUNT,
    payload: list,
  };
};
export const allHost = (list) => {
  return {
    type: ALL_HOST_COUNT,
    payload: list,
  };
};
export const AgvMemberAuctiont = (list) => {
  return {
    type: AVG_MEMBER_AUCTION,
    payload: list,
  };
};

export function actAllUserGetAsync(token) {
  return async (dispatch) => {
    try {
      const response = await UserServices.getAllUser(token);
      if (response.status === 200 || response.status === 201) {
        // toast.success("New Product has been added successfully ~");
        dispatch(allUser(response.data));
      } else {
        // toast.error("Post Product to fail");
        console.log("fail");
      }
    } catch (error) {
      console.error("Error occurred while posting auction:", error);
      // Xử lý lỗi ở đây, ví dụ hiển thị thông báo cho người dùng
    }
  };
}

// export function actUserByIdGetAsync(id, token) {
//   return async (dispatch) => {
//     try {
//       const response = await UserServices.getAllUser(id, token);
//       if (response.status === 200 || response.status === 201) {
//         // toast.success("New Product has been added successfully ~");
//         dispatch(allUser(response.data));
//       } else {
//         // toast.error("Post Product to fail");
//         console.log("fail");
//       }
//     } catch (error) {
//       console.error("Error occurred while posting auction:", error);
//       // Xử lý lỗi ở đây, ví dụ hiển thị thông báo cho người dùng
//     }
//   };
// }

export function actMemberCountGetAsync(token) {
  return (dispatch) => {
    UserServices.getAllMemberCount(token)
      .then((response) => {
        console.log("member count", response);
        if (response.status === 200 || response.status === 201) {
          dispatch(allMember(response.data));
        } else {
          // toast.error("get all syllabus to fail");
          console.log("fail");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while fetching all user:", error);
        // Nếu bạn muốn dispatch một action để xử lý lỗi, bạn có thể thực hiện ở đây
      });
  };
}
export function actHostCountGetAsync(token) {
  return (dispatch) => {
    UserServices.getAllHostCount(token)
      .then((response) => {
        console.log("host count", response);
        if (response.status === 200 || response.status === 201) {
          dispatch(allHost(response.data));
        } else {
          // toast.error("get all syllabus to fail");
          console.log("fail");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while fetching all user:", error);
        // Nếu bạn muốn dispatch một action để xử lý lỗi, bạn có thể thực hiện ở đây
      });
  };
}
export function actAgvMemberAuctiontGetAsync(token) {
  return (dispatch) => {
    UserServices.getAgvMemberAuctiont(token)
      .then((response) => {
        console.log("avg member in auc", response);
        if (response.status === 200 || response.status === 201) {
          dispatch(AgvMemberAuctiont(response.data));
        } else {
          // toast.error("get all syllabus to fail");
          console.log("fail");
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Error while fetching all user:", error);
        // Nếu bạn muốn dispatch một action để xử lý lỗi, bạn có thể thực hiện ở đây
      });
  };
}
