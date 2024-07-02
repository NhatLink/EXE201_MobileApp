import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  AntDesign,
} from "react-native-vector-icons";
import { COLORS, SIZES } from "../constants";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Feather } from "@expo/vector-icons";
import { CheckEmail } from "../components";
import LoginPage from "./LoginPage";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import {
  getUserById,
  logoutUser,
  fetchUser,
  fetchToken,
  resetCheckInStatus,
} from "../store/user/action";
import Loader from "../components/auth/Loader";

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  // const [accessToken, setAccessToken] = useState(null);
  // const [refreshToken, setRefreshToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const { user, accessToken, refreshToken, isAuthenticated } = useSelector(
    (state) => state.USER
  );
  // console.log("user Login:", user);
  // const checkUserExistence = async () => {
  //   const id = await AsyncStorage.getItem("id");
  //   const userID = `user${JSON.parse(id)}`;
  //   try {
  //     const userData = await AsyncStorage.getItem(userID);
  //     if (userData !== null) {
  //       // User data exists
  //       const parsedData = JSON.parse(userData);
  //       // Use the retrieved data as needed
  //       setUserData(parsedData);
  //       setUserLogin(true);
  //     } else {
  //       navigation.navigate("Login");
  //     }
  //   } catch (error) {
  //     console.error("Error retrieving user data:", error);
  //   }
  // };

  // useEffect(() => {
  //   async function fetchDataToken() {
  //     const refreshToken = await SecureStore.getItemAsync("refreshToken");
  //     if (refreshToken) {
  //       dispatch(fetchToken(refreshToken));
  //     }
  //   }
  //   fetchDataToken();
  // }, []);
  // useEffect(() => {
  //   async function fetchData() {
  //     setLoader(true);
  //     const accessToken = await SecureStore.getItemAsync("accessToken");
  //     const refreshToken = await SecureStore.getItemAsync("refreshToken");
  //     const userInfoJson = await SecureStore.getItemAsync("userInfo");
  //     const accountId = await SecureStore.getItemAsync("accountId");
  //     let userInfo = null;
  //     if (userInfoJson) {
  //       try {
  //         userInfo = JSON.parse(userInfoJson);
  //       } catch (error) {
  //         console.error("Error parsing userInfo", error);
  //       }
  //     }
  //     // setAccessToken(accessToken);
  //     setUserInfo(userInfo);
  //     setIdUser(accountId);
  //     if (accessToken) {
  //       dispatch(fetchUser(accessToken));
  //     }
  //     setLoader(false);
  //   }
  //   fetchData();
  // }, []);

  useEffect(() => {
    async function fetchDataTokenAndThenData() {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        await dispatch(
          fetchToken({
            refreshToken: refreshToken,
          })
        );
        fetchData();
      }
    }
    fetchDataTokenAndThenData();
  }, [isAuthenticated]);

  async function fetchData() {
    setLoader(true);
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const userInfoJson = await SecureStore.getItemAsync("userInfo");
    const accountId = await SecureStore.getItemAsync("accountId");
    let userInfo = null;
    if (userInfoJson) {
      try {
        userInfo = JSON.parse(userInfoJson);
      } catch (error) {
        console.error("Error parsing userInfo", error);
      }
    }
    // setAccessToken(accessToken);
    // setRefreshToken(refreshToken);
    setUserInfo(userInfo);
    setIdUser(accountId);
    if (accessToken) {
      await dispatch(fetchUser(accessToken));
    }
    setLoader(false);
  }

  const QRScaner = async () => {
    dispatch(resetCheckInStatus());
    navigation.navigate("QRScanner");
  };

  const deleteAllKeys = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(allKeys);
      console.log("All keys deleted successfully.");
    } catch (error) {
      console.error("Error deleting keys:", error);
    }
  };

  const userLogout = async () => {
    setLoader(true);
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      await dispatch(
        logoutUser({
          refreshToken: refreshToken,
        })
      );
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("userInfo");
      await SecureStore.deleteItemAsync("accountId");
      // setAccessToken(null);
      // setRefreshToken(null);
      setUserInfo(null);
      navigation.navigate("Profile");
      console.log("User logged out");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoader(false);
    }
  };

  const deleteUser = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", onPress: () => console.log("Cancel pressed") },
        { text: "Yes", onPress: () => console.log("Delete pressed") },
      ],
      { defaultIndex: 1 } // Index 1 corresponds to the "Delete" button
    );
  };

  const clearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear all saved data on your device?",
      [
        { text: "Cancel", onPress: () => console.log("Cancel pressed") },
        { text: "Delete", onPress: () => deleteAllKeys() },
      ],
      { defaultIndex: 1 } // Index 1 corresponds to the "Delete" button
    );
  };

  const logout = () => {
    Alert.alert(
      "Đăng xuất khỏi hệ thống",
      "Bạn muốn đăng xuất tài khoản?",
      [
        { text: "Đóng", onPress: () => console.log("Cancel pressed") },
        { text: "Tiếp tục đăng xuất", onPress: () => userLogout() },
      ],
      { defaultIndex: 1 } // Index 1 corresponds to the "Delete" button
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loader} />
      {!isAuthenticated ? (
        <LoginPage />
      ) : (
        <>
          <View style={styles.maiImag2}>
            <View style={styles.containerUser}>
              <TouchableOpacity
                style={styles.containerInfo}
                onPress={() => navigation.navigate("DetailProfile")}
              >
                <Image
                  source={{
                    uri: user?.img,
                  }}
                  resizeMode="cover"
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.title}>{user?.fullName}</Text>
                  <Text style={styles.subtitle}>{user?.phone}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.menuWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
              <View style={styles.menuItem}>
                <MaterialCommunityIcons
                  name="heart-outline"
                  color={COLORS.primary}
                  size={25}
                />
                <Text style={styles.menuItemText}>Salon/Barber yêu thích</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Appointment schedule")}
            >
              <View style={styles.menuItem}>
                <MaterialCommunityIcons
                  name="calendar-multiple"
                  color={COLORS.primary}
                  size={25}
                />
                <Text style={styles.menuItemText}>Lịch hẹn</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
              <View style={styles.menuItem}>
                <MaterialCommunityIcons
                  name="calendar-refresh"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.menuItemText}>Lịch sử lịch hẹn</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("History")}>
              <View style={styles.menuItem}>
                <MaterialCommunityIcons
                  name="alert-decagram-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.menuItemText}>Lịch sử báo cáo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={QRScaner}>
              <View style={styles.menuItem}>
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.menuItemText}>Quét mã QR</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={logout}>
              <View style={styles.menuItem}>
                <AntDesign name="logout" size={24} color={COLORS.primary} />
                <Text style={styles.menuItemText}>Đăng xuất</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={clearCache}>
              <View style={styles.menuItem}>
                <MaterialCommunityIcons
                  name="cached"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.menuItemText}>Clear Cache</Text>
              </View>
            </TouchableOpacity> */}

            {/* <TouchableOpacity onPress={deleteUser}>
              <View style={styles.menuItem}>
                <AntDesign name="deleteuser" size={24} color={COLORS.primary} />
                <Text style={styles.menuItemText}>Delete Account</Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: COLORS.lightWhite,
    marginBottom: 70,
  },
  title: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: SIZES.medium,
    marginHorizontal: 10,
  },
  subtitle: {
    fontWeight: "normal",
    fontSize: SIZES.small,
    marginHorizontal: 10,
  },
  containerUser: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    flexDirection: "row",
  },
  containerInfo: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
    marginLeft: 10,
  },
  avatar: {
    height: 55,
    width: 55,
    borderRadius: 999,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  maiImag2: {
    height: 150,
    width: "100%",
    backgroundColor: COLORS.secondary,
  },
  menuWrapper: {
    marginTop: SIZES.xLarge,
    width: "auto",
    marginHorizontal: 10,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 12,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 0.5,
  },
  menuItemText: {
    fontFamily: "regular",
    color: COLORS.gray,
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 26,
  },
});
