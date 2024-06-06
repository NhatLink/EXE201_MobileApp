import { API } from "./api";

export const UserServices = {
  loginUser(data) {
    return API.post("/api/v1/auth/Login", data);
  },
  fetchMe(data) {
    return API.post("/api/v1/auth/RefreshToken", data);
  },
  logoutUser(data) {
    return API.post("/api/v1/auth/Logout", data);
  },
  registerUser(data) {
    return API.post("/api/v1/accounts/RegisterAccount", data);
  },
  getUserById(id) {
    return API.get(`/api/v1/accounts/GetAccountById/${id}`);
  },
  updateUserById(id, data) {
    return API.put(`/api/v1/accounts/UpdateAccount/${id}`, data);
  },
};
