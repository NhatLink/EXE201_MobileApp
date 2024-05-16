import { API } from "./api";

export const UserServices = {
  loginUser(data) {
    return API.post("/user/login", data);
  },
  fetchMe: (token) => {
    return API.get("/user/fetchMe", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  banUser(id, data, token) {
    return API.put(`/users/ban-user/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getAllUser(token) {
    return API.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  // getOneUser(id, token) {
  //   return API.get("/users//userid/:userid", id, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // },

  getAllMemberCount(token) {
    return API.get("/users/MemberCount", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getAllHostCount(token) {
    return API.get("/users/HostCount", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getAgvMemberAuctiont(token) {
    return API.get("/users/AgvMemberAuction", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
