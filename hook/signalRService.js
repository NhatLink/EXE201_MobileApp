import * as signalR from "@microsoft/signalr";
import * as SecureStore from "expo-secure-store";

// Khởi tạo kết nối SignalR chỉ một lần
const connection = new signalR.HubConnectionBuilder()
  // .withUrl("https://hairhub.gahonghac.net/book-appointment-hub", {
  //   accessTokenFactory: async () => {
  //     const accessToken = await SecureStore.getItemAsync("accessToken");
  //     return accessToken; // Truyền token để backend xác thực
  //   },
  // })
  .withUrl("https://hairhub.gahonghac.net/book-appointment-hub")
  .withAutomaticReconnect()
  .build();

export const startConnection = async () => {
  try {
    await connection.start();
    console.log("SignalR connected");
  } catch (err) {
    console.error("Error while starting connection: ", err);
  }
};

export const stopConnection = async () => {
  try {
    await connection.stop();
    console.log("SignalR disconnected");
  } catch (err) {
    console.error("Error while stopping connection: ", err);
  }
};

export const onEvent = (eventName, callback) => {
  connection.on(eventName, callback);
};

export const sendEvent = async (eventName, data) => {
  try {
    await connection.invoke(eventName, data);
  } catch (err) {
    console.error("Error while sending event: ", err);
  }
};
