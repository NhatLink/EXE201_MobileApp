import { API } from "./api";

export const UserServices = {
  loginUser(data) {
    return API.post("/api/v1/auth/Login", data);
  },
  fetchToken(data) {
    return API.post("/api/v1/auth/RefreshToken", data);
  },
  logoutUser(data) {
    return API.delete("/api/v1/auth/Logout", { data: data });
  },
  registerUser(data) {
    return API.post("/api/v1/accounts/RegisterAccount", data);
  },
  registerUserGoogle(data) {
    return API.post("/api/v1/accounts/RegisterAccountLoginGoogle", data);
  },
  loginUserGoogle(data) {
    return API.post("/api/v1/accounts/GoogleLogin", data);
  },
  getUserById(id) {
    return API.get(`/api/v1/accounts/GetAccountById/${id}`);
  },
  fetchUser(accessToken) {
    return API.get(`/api/v1/auth/FetchUser/${accessToken}`);
  },
  updateUserById(id, data) {
    return API.put(`/api/v1/accounts/UpdateAccount/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updatePasswordUserById(id, data) {
    return API.put(`/api/v1/accounts/ChangePassword/${id}`, data);
  },
  checkInByUser(data) {
    return API.put(`/api/v1/customers/CheckInByCustomer`, data);
  },
  forgotPassword(data) {
    return API.post(`/api/v1/accounts/ForgotPassword`, data);
  },
};
// updateUserById(id, data) {
//   return API.put(`/api/v1/accounts/UpdateAccount/${id}`, data);
// },
// updateUserById(id, data) {
//   let formData = new FormData();

//   // Loop through each key in data object
//   for (let key in data) {
//     formData.append(key, data[key]);
//   }
//   console.log(formData);
//   return API.put(`/api/v1/accounts/UpdateAccount/${id}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// },
