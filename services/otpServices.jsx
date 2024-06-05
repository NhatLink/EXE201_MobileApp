import { API } from "./api";

export const otpServices = {
  sendOtp(data) {
    return API.post("/api/v1/otps/SendOTPToEmail", data);
  },
  checkOtp(data) {
    return API.post("/api/v1/otps/checkOtp", data);
  },
  checkExistEmail(data) {
    return API.post("/api/v1/otps/CheckExistEmail", data);
  },
};
