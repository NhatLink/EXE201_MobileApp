import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants";
const Tab = createBottomTabNavigator();
import { Cart, Home, Profile, Search, Schedule } from "../screens";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { fetchUser2 } from "../store/user/action";
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 70,
  },
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
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={focused ? COLORS.primary : COLORS.gray2}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name="search-sharp"
                size={24}
                color={focused ? COLORS.primary : COLORS.gray2}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Appointment schedule"
        component={Schedule}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={24}
                color={focused ? COLORS.primary : COLORS.gray2}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? COLORS.primary : COLORS.gray2}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
