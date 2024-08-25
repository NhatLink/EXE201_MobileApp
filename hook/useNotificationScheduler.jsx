import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { COLORS } from "../constants";
import { useNavigation } from "@react-navigation/native";

export function useNotificationScheduler() {
  const navigation = useNavigation();
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log("Notification response:", response);
        navigation.navigate("Appointment schedule");
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const scheduleNotification = async ({
    title,
    body,
    data,
    triggerInSeconds,
    importance = Notifications.AndroidImportance.DEFAULT, // Mặc định là mức quan trọng thông thường
    vibrationPattern = [0, 250, 250, 250], // Mẫu rung mặc định
    lightColor = COLORS.secondary, // Màu sáng mặc định
  }) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
      },
      trigger: { seconds: triggerInSeconds },
    });

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("Thông báo lịch hẹn", {
        name: "Thông báo lịch hẹn",
        importance: importance,
        vibrationPattern: vibrationPattern,
        lightColor: lightColor,
      });
    }
  };

  return { scheduleNotification, expoPushToken };
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  // if (Platform.OS === "android") {
  //   Notifications.setNotificationChannelAsync("Thông báo demo", {
  //     name: "Thông báo demo",
  //     importance: Notifications.AndroidImportance.MAX,
  //     vibrationPattern: [0, 250, 250, 250],
  //     lightColor: COLORS.secondary,
  //   });
  // }

  return token;
}
