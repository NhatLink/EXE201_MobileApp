import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Button,
  TextInput,
  Keyboard,
  ToastAndroid,
  Alert,
  BackHandler,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, images } from "../constants";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { UserServices } from "../services/userServices";
import { fetchUser, LOGIN_FAIL, LOGIN_SUCCESS } from "../store/user/action";
import * as SecureStore from "expo-secure-store";
import Loader from "../components/auth/Loader";

const RegisterWithGoogle = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [loader, setLoader] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const dispatch = useDispatch();

  const handleContinuePress = async () => {
    if (!phone) {
      setPhoneError("Số điện thoại không được để trống");
      return;
    }
    // Kiểm tra độ dài của số điện thoại (phải là 10 số)
    if (phone.length !== 10) {
      setPhoneError("Số điện thoại phải có đúng 10 số");
      return;
    }

    // Kiểm tra nếu số điện thoại chứa ký tự không phải số
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Số điện thoại chỉ được chứa chữ số");
      return;
    }

    registerUserGoogle(phone);
  };

  const registerUserGoogle = async (phone) => {
    Keyboard.dismiss();
    setLoader(true);
    if (!phone) return;
    const idToken = await SecureStore.getItemAsync("idToken");
    if (!idToken) {
      console.log("ID Token không tồn tại trong SecureStore");
      ToastAndroid.show("Lỗi xác thực. Vui lòng thử lại.", ToastAndroid.SHORT);
      navigation.navigate("Profile");
      return;
    }
    try {
      const response = await UserServices.registerUserGoogle({
        idToken: idToken,
        roleName: "Customer",
        phone: phone,
        type: "Android",
      });
      if (response.data.roleName === "Customer") {
        dispatch({ type: LOGIN_SUCCESS, payload: response.data });
        dispatch(fetchUser(response.data.accessToken));
        // Lưu vào SecureStore
        SecureStore.setItemAsync("accessToken", response.data.accessToken);
        SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
        SecureStore.setItemAsync("accountId", response.data.accountId);
        SecureStore.setItemAsync(
          "userInfo",
          JSON.stringify(response.data.customerResponse)
        );
        ToastAndroid.show("đăng nhập thành công", ToastAndroid.SHORT);
        navigation.navigate("Profile");
      } else {
        console.log("Tài khoản của bạn không thể đăng nhập");
        ToastAndroid.show(
          "Tài khoản của bạn không thể đăng nhập vào app dành cho khách hàng",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.log("Unexpected error:", error);
      dispatch({ type: LOGIN_FAIL, payload: error.response.data });
      ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
    } finally {
      setLoader(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = async () => {
        const idToken = await SecureStore.getItemAsync("idToken");

        if (idToken) {
          // Hiển thị cảnh báo nếu idToken tồn tại
          Alert.alert(
            "Cảnh báo",
            "Bạn có chắc muốn quay lại? Dữ liệu đăng nhập sẽ bị mất.",
            [
              {
                text: "Hủy",
                onPress: () => null,
                style: "cancel",
              },
              {
                text: "Quay lại",
                onPress: async () => {
                  // Xóa idToken khỏi SecureStore
                  await SecureStore.deleteItemAsync("idToken");
                  navigation.goBack(); // Quay lại màn hình trước
                }, // Quay lại màn hình trước
              },
            ],
            { cancelable: true }
          );
          return true; // Chặn sự kiện quay lại mặc định
        }

        return false; // Cho phép quay lại nếu không có idToken
      };

      // Thêm sự kiện BackHandler
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Gỡ bỏ sự kiện BackHandler khi màn hình mất focus
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container2}>
      <Loader visible={loader} />
      <View>
        {/* <TouchableOpacity
          style={styles.buttonClose}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            style={styles.textStyle}
            name="return-up-back"
            size={24}
            color="black"
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.buttonClose}
          onPress={async () => {
            const idToken = await SecureStore.getItemAsync("idToken");

            if (idToken) {
              Alert.alert(
                "Cảnh báo",
                "Bạn có chắc muốn quay lại? Dữ liệu đăng nhập sẽ bị mất.",
                [
                  { text: "Hủy", onPress: () => null, style: "cancel" },
                  {
                    text: "Quay lại",
                    onPress: async () => {
                      // Xóa idToken khỏi SecureStore
                      await SecureStore.deleteItemAsync("idToken");
                      navigation.goBack(); // Quay lại màn hình trước
                    },
                  },
                ],
                { cancelable: true }
              );
            } else {
              navigation.goBack(); // Không có idToken thì quay lại bình thường
            }
          }}
        >
          <Ionicons
            style={styles.textStyle}
            name="return-up-back"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <Text style={styles.title2}>Còn 1 bước nữa là bạn hoàn tất</Text>
        <Text style={styles.subtitle2}>
          Hãy nhập số điện thoại của mình để hoàn tất việc đăng kí vào hệ thống
        </Text>

        <View style={styles.searchContainer}>
          <TouchableOpacity>
            <Feather
              style={styles.searchIcon}
              name="smartphone"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              value={phone}
              keyboardType="numeric"
              placeholder="Số điện thoại ?"
              onChangeText={(text) => {
                setPhone(text);
                setPhoneError(""); // Clear error when user starts typing
              }}
            />
          </View>
          {phone && (
            <TouchableOpacity onPress={() => setPhone("")}>
              <Ionicons
                style={styles.deleteIcon}
                name="close-circle-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          )}
        </View>
        {phoneError ? (
          <Text style={{ color: "red", marginTop: 5, marginHorizontal: 20 }}>
            {phoneError}
          </Text>
        ) : null}
        <TouchableOpacity onPress={handleContinuePress}>
          <Text style={styles.button}>Hoàn tất việc đăng kí</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterWithGoogle;

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
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
    backgroundColor: COLORS.primary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: "bold",
    color: COLORS.lightWhite,
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
  buttonClose: {
    marginTop: SIZES.small,
    marginLeft: SIZES.small,
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenModal1: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 10,
    backgroundColor: COLORS.lightWhite,
    color: COLORS.lightWhite,
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTextTitle: {
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: SIZES.medium,
    marginLeft: 10,
  },
  buttonCloseModal: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
  },
});
