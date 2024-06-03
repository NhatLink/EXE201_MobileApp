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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/IP";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
const LoginPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (email) {
  //     setInputs((prevState) => ({ ...prevState, username: email }));
  //   }
  // }, [email]);

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    const { password, username } = inputs;
    if (!username) {
      handleError("Username is required", "username");
      valid = false;
    } else if (username.length < 3) {
      handleError("At least 3 characters are required", "username");
      valid = false;
    }
    if (!password) {
      handleError("Password is required", "password");
      valid = false;
    } else if (password.length < 8) {
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
      const endpoint = `${baseUrl}/user/login`;
      const data = inputs;
      console.log(data);

      const response = await axios.post(endpoint, data);

      const responseData = response.data;
      console.log("login response", responseData);

      setLoader(false);
      try {
        await AsyncStorage.setItem(
          "accessToken",
          JSON.stringify(responseData.token)
        );
        await AsyncStorage.setItem(
          `user${responseData.user._id}`,
          JSON.stringify(responseData.user)
        );
        await AsyncStorage.setItem("id", JSON.stringify(responseData.user._id));
        navigation.replace("Bottom Navigation");
      } catch (error) {
        console.error("Storage error:", error);
        Alert.alert(
          "Error",
          "Oops, something went wrong with storage. Try again"
        );
      }
    } catch (error) {
      setLoader(false);
      console.error("Login error:", error);
      Alert.alert("Error", "Oops, something went wrong. Try again");
    }
  };

  const handleChanges = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
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
            onPress={() => navigation.navigate("Signup")}
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
    marginBottom: 20,
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
