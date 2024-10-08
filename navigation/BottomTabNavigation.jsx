import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
const Tab = createBottomTabNavigator();
import {
  Cart,
  Home,
  Profile,
  Search,
  Schedule,
  Notifications,
} from "../screens";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { fetchUser2 } from "../store/user/action";
import { Text } from "react-native";
const screenOptions = {
  // tabBarShowLabel: false,
  headerShown: false,
  tabBarHideOnKeyboard: true,
  // tabBarStyle: {
  //   position: "absolute",
  //   bottom: 0,
  //   right: 0,
  //   left: 0,
  //   elevation: 0,
  //   height: 70,
  // },
};

const BottomTabNavigation = () => {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   const handleUserFetch = async () => {
  //     try {
  //       console.log("fetchUser2");
  //       const accessToken = await SecureStore.getItemAsync("accessToken");
  //       if (accessToken) {
  //         await dispatch(fetchUser2(accessToken));
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy accessToken", error);
  //     }
  //   };

  //   handleUserFetch();
  // }, [dispatch]);
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={focused ? COLORS.secondary : COLORS.gray2}
            />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: SIZES.xSmall,
                }}
              >
                Trang chủ
              </Text>
            ) : null, // Không hiển thị label khi không focus
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="search-sharp"
              size={24}
              color={focused ? COLORS.secondary : COLORS.gray2}
            />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: SIZES.xSmall,
                }}
              >
                Tìm kiếm
              </Text>
            ) : null,
        }}
      />

      <Tab.Screen
        name="Appointment schedule"
        component={Schedule}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={24}
              color={focused ? COLORS.secondary : COLORS.gray2}
            />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: SIZES.xSmall,
                }}
              >
                Lịch hẹn
              </Text>
            ) : null,
        }}
      />

      {/* <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={24}
              color={focused ? COLORS.secondary : COLORS.gray2}
            />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: SIZES.xSmall,
                }}
              >
                Thông báo
              </Text>
            ) : null,
        }}
      /> */}

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={focused ? COLORS.secondary : COLORS.gray2}
            />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: SIZES.xSmall,
                }}
              >
                Cá nhân
              </Text>
            ) : null,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
