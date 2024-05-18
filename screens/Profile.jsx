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

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [userLogin, setUserLogin] = useState(false);
  const [searchKeyService, setSearchKeyService] = useState("");

  // useEffect(() => {
  //   checkUserExistence();
  // }, []);
  const checkUserExistence = async () => {
    const id = await AsyncStorage.getItem("id");
    const userID = `user${JSON.parse(id)}`;
    try {
      const userData = await AsyncStorage.getItem(userID);
      if (userData !== null) {
        // User data exists
        const parsedData = JSON.parse(userData);
        // Use the retrieved data as needed
        setUserData(parsedData);
        setUserLogin(true);
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
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
    const id = await AsyncStorage.getItem("id");
    const userID = `user${JSON.parse(id)}`;
    try {
      await AsyncStorage.multiRemove([userID, "accessToken", "id"]);
      navigation.replace("Bottom Navigation");
    } catch (error) {
      console.error("Error deleting keys:", error);
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
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", onPress: () => console.log("Cancel pressed") },
        { text: "Continue", onPress: () => userLogout() },
      ],
      { defaultIndex: 1 } // Index 1 corresponds to the "Delete" button
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {userLogin ? (
        <>
          <View style={styles.maiImag2}>
            <View style={styles.containerUser}>
              <View style={styles.containerInfo}>
                <Image
                  source={{
                    uri: "https://cafefcdn.com/2020/6/5/photo-1-1591315359692156876277.jpg",
                  }}
                  resizeMode="cover"
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.title}>Nhật Linh</Text>
                  <Text style={styles.subtitle}>
                    nguyenbanhatlinh666@gmail.com
                  </Text>
                </View>
              </View>
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
                <Text style={styles.menuItemText}>Favorites</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
              <View style={styles.menuItem}>
                <MaterialCommunityIcons
                  name="truck-delivery-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.menuItemText}>Orders</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
              <View style={styles.menuItem}>
                <SimpleLineIcons name="bag" size={24} color={COLORS.primary} />
                <Text style={styles.menuItemText}>Cart</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={logout}>
              <View style={styles.menuItem}>
                <AntDesign name="logout" size={24} color={COLORS.primary} />
                <Text style={styles.menuItemText}>Logout</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={clearCache}>
              <View style={styles.menuItem}>
                <MaterialCommunityIcons
                  name="cached"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.menuItemText}>Clear Cache</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={deleteUser}>
              <View style={styles.menuItem}>
                <AntDesign name="deleteuser" size={24} color={COLORS.primary} />
                <Text style={styles.menuItemText}>Delete Account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.container2}>
          <View>
            <Text style={styles.title2}>Chào mừng đến với HairHub</Text>
            <Text style={styles.subtitle2}>
              Tạo tài khoản hoặc đăng kí để đặt lịch vá quản lý các cuộc hẹn của
              mình.
            </Text>

            <View style={styles.searchContainer}>
              <TouchableOpacity>
                <Feather
                  style={styles.searchIcon}
                  name="mail"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <View style={styles.searchWrapper}>
                <TextInput
                  style={styles.searchInput}
                  value={searchKeyService}
                  placeholder="Email?"
                  onChange={setSearchKeyService}
                />
              </View>
              {searchKeyService && (
                <TouchableOpacity onPress={() => setSearchKeyService("")}>
                  <Ionicons
                    style={styles.deleteIcon}
                    name="close-circle-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.button}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
            }}
          >
            <View style={styles.containerDate}>
              <View style={styles.line} />
              <Text style={styles.text}>or</Text>
              <View style={styles.line} />
            </View>
            <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
              <Ionicons
                style={styles.searchIcon}
                name="logo-google"
                size={24}
                color="black"
              />
              <Text style={styles.button1}>Tiếp tục với Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
              <Ionicons
                style={styles.searchIcon}
                name="logo-facebook"
                size={24}
                color="black"
              />
              <Text style={styles.button1}>Tiếp tục với Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  container2: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    // marginBottom: 70,
    paddingTop: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  title2: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: SIZES.large,
    marginHorizontal: 10,
    paddingTop: 20,
  },
  subtitle2: {
    fontWeight: "normal",
    fontSize: SIZES.small,
    marginHorizontal: 10,
    color: COLORS.gray,
    paddingTop: 10,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.offwhite,
    borderRadius: SIZES.small,
    marginTop: SIZES.xxLarge,
    height: 50,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  searchWrapper: {
    flex: 1,
    marginRight: SIZES.xSmall,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.small,
    height: "100%",
  },
  searchInput: {
    fontFamily: "regular",
    color: COLORS.black,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.xSmall,
  },
  searchBtn: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },

  searchIcon: {
    marginLeft: 10,
    color: "gray",
  },
  deleteIcon: {
    // position: "absolute",
    // top: 12,
    // right: 10,
    marginRight: 5,
    color: "gray",
  },
  bookButton: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.black,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  button: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: "bold",
  },
  button1: {
    marginLeft: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  containerDate: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray,
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: "bold",
  },
});
