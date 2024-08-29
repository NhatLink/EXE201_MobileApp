import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";

export const API = axios.create({
  baseURL:
    // "https://be-orchid-auction.onrender.com",
    // "http://14.225.218.91:8080",
    "https://hairhub.gahonghac.net",
});

API.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    console.log("accessToken in api", accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho phản hồi từ API
// API.interceptors.response.use(
//   (response) => {
//     console.log("Status code:", response.status);
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       console.log("Error status code:", error.response.status);
//       console.log("Error data:", error.response.data);

//       // Kiểm tra mã lỗi 401 và hiển thị toast
//       if (error.response.status === 401) {
//         ToastAndroid.showWithGravity(
//           "Hết hạn đăng nhập, vui lòng đăng nhập lại.",
//           ToastAndroid.SHORT
//         );
//       }
//     } else if (error.request) {
//       console.log("No response received:", error.request);
//     } else {
//       console.log("Error:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );
