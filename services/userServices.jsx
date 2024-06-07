import { API } from "./api";

export const UserServices = {
  loginUser(data) {
    return API.post("/api/v1/auth/Login", data);
  },
  fetchMe(data) {
    return API.post("/api/v1/auth/RefreshToken", data);
  },
  logoutUser(data) {
    return API.delete("/api/v1/auth/Logout", { data: data });
  },
  registerUser(data) {
    return API.post("/api/v1/accounts/RegisterAccount", data);
  },
  getUserById(id) {
    return API.get(`/api/v1/accounts/GetAccountById/${id}`);
  },
  // updateUserById(id, data) {
  //   return API.put(`/api/v1/accounts/UpdateAccount/${id}`, data);
  // },
  updateUserById(id, data) {
    let formData = new FormData();

    // Loop through each key in data object
    for (let key in data) {
      formData.append(key, data[key]);
    }
    console.log(formData);
    return API.put(`/api/v1/accounts/UpdateAccount/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
