import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import axios from "axios";
import Input from "../components/auth/input";
import Button from "../components/auth/Button";
import BackButton from "../components/auth/BackButton";
import Picker from "../components/auth/Picker";
import Loader from "../components/auth/Loader";
import { baseUrl } from "../utils/IP";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { OtpModal } from "../components";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "react-native-calendars";
import { forgotPassword, registerUser } from "../store/user/action";
import { useDispatch, useSelector } from "react-redux";
const ResetPassword = () => {
  const [loader, setLoader] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [inputs, setInputs] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [confirmPassword, setConfirmpassword] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  useEffect(() => {
    if (email) {
      setInputs((prevState) => ({ ...prevState, email: email }));
    }
  }, [email]);

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };
  const dispatch = useDispatch();
  const validate = () => {
    let valid = true;
    const { newPassword, confirmNewPassword } = inputs;

    if (!newPassword) {
      handleError("Chưa nhập mật khẩu mới", "newPassword");
      valid = false;
    } else if (newPassword.length < 8) {
      handleError("Mật khẩu cần ít nhất 8 kí tự", "newPassword");
      valid = false;
    } else if (newPassword.length > 30) {
      handleError("Mật khẩu không vượt quá 30 kí tự", "newPassword");
      valid = false;
    } else if (!/^[A-Z]/.test(newPassword)) {
      handleError("Kí tự đầu tiên phải là chữ cái viết hoa", "newPassword");
      valid = false;
    } else if (!/\d/.test(newPassword)) {
      handleError("Mật khẩu phải chứa ít nhất một chữ số", "newPassword");
      valid = false;
    }
    if (!confirmNewPassword) {
      handleError("Chưa nhập mật khẩu xác nhận", "confirmNewPassword");
      valid = false;
    } else if (confirmNewPassword !== newPassword) {
      handleError(
        "Mật khẩu xác nhận chưa trùng với mật khẩu mới",
        "confirmNewPassword"
      );
      valid = false;
    }
    if (valid) {
      register();
    }
  };

  const register = async () => {
    setLoader(true);
    try {
      await dispatch(forgotPassword(inputs, navigation));
      //   navigation.navigate("Profile");
      // console.log("inputs resetpass", inputs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleChanges = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  // const pickImageFromGallery = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== "granted") {
  //     alert("Sorry, we need camera roll permissions to make this work!");
  //     return;
  //   }

  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setInputs((prevState) => ({
  //       ...prevState,
  //       avatar: result.assets[0].uri,
  //     }));
  //   }
  // };

  // const pickImageFromCamera = async () => {
  //   const { status } = await ImagePicker.requestCameraPermissionsAsync();
  //   if (status !== "granted") {
  //     alert("Sorry, we need camera permissions to make this work!");
  //     return;
  //   }

  //   let result = await ImagePicker.launchCameraAsync({
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setInputs((prevState) => ({
  //       ...prevState,
  //       avatar: result.assets[0].uri,
  //     }));
  //   }
  // };

  // const onChangeDate = (event, selectedDate) => {
  //   const currentDate = selectedDate || inputs.dayOfBirth;
  //   // setShowDatePicker(Platform.OS === "ios");
  //   setShowDatePicker(false);
  //   setInputs((prevState) => ({ ...prevState, dayOfBirth: currentDate }));
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loader} />
      {/* <KeyboardAvoidingView>
          <View> */}
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
      <Text style={styles.motto}>Thay đổi mật khẩu</Text>
      <Text style={styles.submotto}>
        {`Hãy nhập mật khẩu mới với tư cách là ${email}`}
      </Text>
      <Input
        placeholder="Enter email"
        icon="email-outline"
        label="Email"
        value={inputs.email}
        error={errors.email}
        onFocus={() => handleError(null, "userName")}
        onChangeText={(text) => handleChanges(text, "userName")}
        editable={false}
      />

      <Input
        placeholder="Mật khẩu"
        icon="lock-outline"
        label="Mật khẩu"
        error={errors.newPassword}
        onFocus={() => handleError(null, "newPassword")}
        onChangeText={(text) => handleChanges(text, "newPassword")}
        password={true}
      />

      <Input
        placeholder="Xác nhận mật khẩu"
        icon="lock-outline"
        label="Xác nhận mật khẩu"
        error={errors.confirmNewPassword}
        onFocus={() => handleError(null, "confirmNewPassword")}
        onChangeText={(text) => handleChanges(text, "confirmNewPassword")}
        password={true}
      />

      {/* <View style={styles.avatarContainer}>
                <Text style={styles.subtext}>Avatar</Text>
                {!inputs.avatar && (
                  <View style={styles.avatarButtonContainer}>
                    <TouchableOpacity
                      style={styles.buttonleft}
                      onPress={pickImageFromGallery}
                    >
                      <Text>Pick an image from camera roll</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonright}
                      onPress={pickImageFromCamera}
                    >
                      <Text>Take a photo</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {errors.avatar && (
                  <Text style={styles.erroMsg}>{errors.avatar}</Text>
                )}
                {inputs.avatar && (
                  <View style={styles.containerInfo}>
                    <Image
                      source={{ uri: inputs.avatar }}
                      style={styles.avatar}
                    />
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() =>
                        setInputs((prevState) => ({ ...prevState, avatar: null }))
                      }
                    >
                      <Ionicons
                        name="close-circle"
                        size={30}
                        color={COLORS.black}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View> */}

      <Button title="Thay đổi mật khẩu" onPress={validate} />
      {/* </View>
        </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    // marginTop: 20,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    // paddingTop: 30,
    paddingHorizontal: 20,
  },
  inputView: {
    marginHorizontal: 20,
  },
  registered: {
    marginTop: 10,
    color: COLORS.black,
    textAlign: "center",
  },
  img: {
    height: SIZES.height / 3,
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
    width: "100%",
    marginTop: SIZES.xSmall,
    fontWeight: "bold",
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: "left",
    marginBottom: 10,
  },
  buttonClose: {
    marginTop: SIZES.small,
  },
  containerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 999,
    borderColor: COLORS.primary,
    borderWidth: 5,
  },
  cancelButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  buttonleft: {
    padding: 15,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: COLORS.secondary,
    borderRightWidth: 1,
    borderRightColor: COLORS.gray,
  },
  buttonright: {
    padding: 15,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: COLORS.secondary,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.gray,
  },
  subtext: {
    marginBottom: 5,
    fontFamily: "regular",
    fontSize: SIZES.small,
  },
  subtext2: {
    marginBottom: 5,
    fontFamily: "regular",
    fontSize: SIZES.small,
    textDecorationLine: "underline",
  },
  avatarButtonContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  erroMsg: {
    color: COLORS.red,
    marginTop: 6,
    marginLeft: 5,
    fontFamily: "regular",
    fontSize: SIZES.xSmall,
  },
});
