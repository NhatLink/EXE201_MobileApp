import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import Input from "../components/auth/input";
import Button from "../components/auth/Button";
import BackButton from "../components/auth/BackButton";
import React, { useEffect, useState } from "react";
import {
  fetchUser,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  loginUser,
} from "../store/user/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/IP";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import Loader from "../components/auth/Loader";
import { resetCheckOtp } from "../store/otp/action";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { UserServices } from "../services/userServices";

const androidClientId =
  "435735956374-biv1qavtd6b0b79a1372s99v10qfsnpj.apps.googleusercontent.com";
const redirectUri = "com.nhatlink.hairhub:/oauth2redirect";
WebBrowser.maybeCompleteAuthSession();
const LoginPage = () => {
  const config = {
    androidClientId,
    redirectUri,
  };
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  // const [accessToken, setAccessToken] = useState(null);
  // const [refreshToken, setRefreshToken] = useState(null);
  // const [userInfo, setUserInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userTokenGoogle, setUserTokenGoogle] = useState(null);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  // const user = useSelector((state) => state.USER.user);
  // const error = useSelector((state) => state.USER.error);
  // const isAuthenticated = useSelector((state) => state.USER.isAuthenticated);
  const { isAuthenticated, error, user, accountId } = useSelector(
    (state) => state.USER
  );

  const getUserProfileGoogle = async (token) => {
    if (!token) return;
    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await userInfoResponse.json();
      setUserInfo(user);
      console.log(user);
    } catch (error) {
      console.log("gooole login", error);
    }
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(config);

  const handleToken = () => {
    if (response && response.type === "success") {
      const { authentication } = response;
      // const token = authentication?.accessToken;
      const idToken = authentication?.idToken;
      // console.log("Atoken", token);
      console.log("IdToken", idToken);
      // SecureStore.setItemAsync("AccesstokenGoogle", token);
      SecureStore.setItemAsync("idToken", idToken);
      // setUserTokenGoogle(token);
      // getUserProfileGoogle(token);
      loginUserGoogle(idToken);
    }
  };

  useEffect(() => {
    handleToken();
  }, [response]);

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    // console.log("login", inputs);
    // if (!inputs.username) {
    //   handleError("Phone is required", "username");
    //   valid = false;
    // } else if (!inputs.username.match(/^[0-9]{10,12}$/)) {
    //   handleError("Provide a valid phone number", "username");
    //   valid = false;
    // }
    // if (!inputs.username) {
    //   handleError("Username is required", "username");
    //   valid = false;
    // } else if (inputs.username.length < 3) {
    //   handleError("At least 3 characters are required", "username");
    //   valid = false;
    // }
    if (!inputs.username) {
      handleError("Chưa nhập email", "username");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(inputs.username)) {
      handleError("Email phải hợp lệ", "username");
      valid = false;
    }
    if (!inputs.password) {
      handleError("Chưa nhập mật khẩu", "password");
      valid = false;
    } else if (inputs.password.length < 8) {
      handleError("Mật khẩu phải có ít nhất 8 kí tự", "password");
      valid = false;
    }
    if (valid) {
      login();
    }
  };

  const login = async () => {
    setLoader(true);
    try {
      // Dispatching the loginUser action with inputs
      await dispatch(loginUser(inputs));
      // navigation.replace("Bottom Navigation");
      // navigation.navigate("Profile");
      // Handling post-login logic can be done within the loginUser action or here
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Oops, something went wrong. Try again");
    } finally {
      setLoader(false);
    }
  };

  const handleChanges = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    if (errors[input]) {
      handleError(null, input);
    }
  };

  const handleRegister = () => {
    Keyboard.dismiss();
    dispatch(resetCheckOtp());
    navigation.navigate("CheckEmail"); //CheckEmail
  };

  const handleForgotPass = () => {
    Keyboard.dismiss();
    dispatch(resetCheckOtp());
    navigation.navigate("CheckNonExistEmail");
  };

  const loginUserGoogle = async (idToken) => {
    if (!idToken) return;
    setLoader(true);
    try {
      const response = await UserServices.loginUserGoogle({
        idToken: idToken,
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
      } else {
        console.log("Tài khoản của bạn không thể đăng nhập");
        ToastAndroid.show(
          "Tài khoản của bạn không thể đăng nhập vào app dành cho khách hàng",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          navigation.navigate("RegisterWithGoogle");
        } else {
          console.log("error login:", error);
          dispatch({ type: LOGIN_FAIL, payload: error.response.data });
          ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        }
      } else {
        console.log("Unexpected error:", error);
        ToastAndroid.show("Đã xảy ra lỗi không mong muốn", ToastAndroid.SHORT);
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader visible={loader} />
      <View style={styles.container}>
        <View>
          {/* <BackButton onPress={() => navigation.goBack()} />
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              style={styles.textStyle}
              name="return-up-back"
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <Image
            source={require("../assets/images/bk.png")}
            style={styles.img}
          /> */}
          <Text style={styles.motto}>Chào mừng</Text>
          <Text style={styles.submotto}>
            Điền thông tin để đăng nhập vào HairHub
          </Text>
          <Input
            placeholder="Nhập email của bạn"
            icon="email"
            label={"Email"}
            error={errors.username}
            onFocus={() => {
              handleError(null, "username");
            }}
            onChangeText={(text) => handleChanges(text, "username")}
            // keyboardType="numeric"
          />

          <Input
            placeholder="Mật khẩu"
            icon="lock-outline"
            label={"Mật khẩu"}
            error={errors.password}
            onFocus={() => {
              handleError(null, "password");
            }}
            onChangeText={(text) => handleChanges(text, "password")}
            password={true}
          />
          <Text
            style={styles.registered}
            // onPress={() => navigation.navigate("Signup")}
            onPress={handleForgotPass}
          >
            Quên mật khẩu
          </Text>
          {/* {userInfo && (
            <View style={styles.containerGoogleInfo}>
              <Image
                source={{ uri: userInfo?.picture }}
                style={styles.profileImage}
              />
              <Text style={styles.name}>{userInfo?.name}</Text>
              <Text style={styles.name}>{userInfo?.email}</Text>
            </View>
          )} */}
        </View>
        <View>
          <Button title={"Đăng nhập"} onPress={validate} />
          {/* <Button
            title={"Đăng nhập bằng Google"}
            onPress={() => promptAsync()}
          /> */}
          <View style={styles.containerGoogleLogin}>
            <TouchableOpacity
              style={styles.buttonGoogleLogin}
              onPress={() => promptAsync()}
            >
              {/* Icon từ Feather cho Google */}
              <Ionicons
                name="logo-google"
                size={24}
                color="white"
                style={styles.iconGoogleLogin}
              />
              <Text style={styles.buttonTextGoogleLogin}>
                Đăng nhập bằng Google
              </Text>
              {/* Icon từ Feather */}
              <Feather
                name="arrow-right"
                size={24}
                color="white"
                style={styles.iconGoogleLogin}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={styles.registered}
            // onPress={() => navigation.navigate("Signup")}
            onPress={handleRegister}
          >
            Bạn chưa có tài khoản ? Đăng kí ngay
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    // marginHorizontal: 20,
    paddingHorizontal: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  img: {
    height: SIZES.height / 2.4,
    width: SIZES.width - 60,
    resizeMode: "contain",
    marginBottom: SIZES.xxLarge,
  },

  motto: {
    marginTop: SIZES.xSmall,
    fontWeight: "bold",
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    textAlign: "left",
  },
  submotto: {
    marginTop: SIZES.xSmall,
    fontWeight: "bold",
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: "left",
    marginBottom: 15,
  },
  submotto2: {
    fontWeight: "bold",
    fontSize: SIZES.medium,
    color: COLORS.black,
    textAlign: "left",
    marginBottom: 15,
  },

  registered: {
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 5,
  },
  buttonClose: {
    marginTop: SIZES.small,
  },
  containerGoogleInfo: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Giúp hình ảnh thành hình tròn
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  containerGoogleLogin: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonGoogleLogin: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#4285F4", // Màu xanh đặc trưng của Google
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2, // Tạo hiệu ứng đổ bóng
  },
  iconGoogleLogin: {
    marginHorizontal: 5,
  },
  buttonTextGoogleLogin: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
