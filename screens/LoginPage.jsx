import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import Input from "../components/auth/input";
import Button from "../components/auth/Button";
import BackButton from "../components/auth/BackButton";
import React, { useEffect, useState } from "react";
import { loginUser } from "../store/user/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/IP";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  // const [accessToken, setAccessToken] = useState(null);
  // const [refreshToken, setRefreshToken] = useState(null);
  // const [userInfo, setUserInfo] = useState(null);

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
  // useEffect(() => {
  //   async function fetchData() {
  //     const accessToken = await SecureStore.getItemAsync("accessToken");
  //     const refreshToken = await SecureStore.getItemAsync("refreshToken");
  //     const userInfoJson = await SecureStore.getItemAsync("userInfo");
  //     const userInfo = JSON.parse(userInfoJson);
  //     setAccessToken(accessToken);
  //     setRefreshToken(refreshToken);
  //     setUserInfo(userInfo);
  //   }

  //   fetchData();
  // }, []);

  // console.log("accessToken", accessToken);
  // console.log("refreshToken", refreshToken);
  // console.log("userInfo", userInfo);
  console.log("user", user);
  console.log("accountId", accountId);
  console.log("is Auth", isAuthenticated);
  console.log("error", error);
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.username) {
      handleError("Username is required", "username");
      valid = false;
    } else if (inputs.username.length < 3) {
      handleError("At least 3 characters are required", "username");
      valid = false;
    }
    if (!inputs.password) {
      handleError("Password is required", "password");
      valid = false;
    } else if (inputs.password.length < 8) {
      handleError("At least 8 characters are required", "password");
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
      navigation.replace("Bottom Navigation");
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            placeholder="Enter username"
            icon="account-lock-outline"
            label={"UserName"}
            error={errors.username}
            onFocus={() => {
              handleError(null, "username");
            }}
            onChangeText={(text) => handleChanges(text, "username")}
          />

          <Input
            placeholder="Password"
            icon="lock-outline"
            label={"Password"}
            error={errors.password}
            onFocus={() => {
              handleError(null, "password");
            }}
            onChangeText={(text) => handleChanges(text, "password")}
            password={true}
          />
        </View>
        <View>
          <Button title={"LOGIN"} onPress={validate} />
          <Text
            style={styles.registered}
            onPress={() => navigation.navigate("CheckEmail")}
          >
            Don't have an account? Register
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
  },
  buttonClose: {
    marginTop: SIZES.small,
  },
});
