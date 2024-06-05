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
import { registerUser } from "../store/user/action";
import { useDispatch, useSelector } from "react-redux";
const Signup = () => {
  const [loader, setLoader] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    // confirmPassword: "",
    gender: "Male",
    fullName: "",
    phone: "",
    roleName: "Customer",
    dayOfBirth: new Date(),
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [confirmPassword, setConfirmpassword] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  useEffect(() => {
    if (email) {
      setInputs((prevState) => ({ ...prevState, email }));
    }
  }, [email]);

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };
  const dispatch = useDispatch();
  const validate = () => {
    let valid = true;
    const {
      email,
      password,
      // confirmPassword,
      username,
      address,
      fullName,
      phone,
      gender,
      dayOfBirth,
      // avatar,
    } = inputs;

    if (!email) {
      handleError("Email is required", "email");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      handleError("Provide a valid email", "email");
      valid = false;
    }

    if (!password) {
      handleError("Password is required", "password");
      valid = false;
    } else if (password.length < 8) {
      handleError("At least 8 characters are required", "password");
      valid = false;
    }
    if (!confirmPassword) {
      handleError("Confirm Password is required", "confirmPassword");
      valid = false;
    } else if (confirmPassword !== password) {
      handleError("Passwords do not match", "confirmPassword");
      valid = false;
    }

    if (!username) {
      handleError("Username is required", "username");
      valid = false;
    } else if (username.length < 3) {
      handleError("At least 3 characters are required", "username");
      valid = false;
    }

    if (!fullName) {
      handleError("Full name is required", "fullName");
      valid = false;
    } else if (fullName.length < 3) {
      handleError("At least 3 characters are required", "fullName");
      valid = false;
    }

    // if (!address) {
    //   handleError("Address is required", "address");
    //   valid = false;
    // }

    if (!phone) {
      handleError("Phone is required", "phone");
      valid = false;
    } else if (!phone.match(/^[0-9]{10,12}$/)) {
      handleError("Provide a valid phone number", "phone");
      valid = false;
    }

    if (!gender) {
      handleError("Gender is required", "gender");
      valid = false;
    }

    if (!dayOfBirth) {
      handleError("Birthdate is required", "dayOfBirth");
      valid = false;
    }

    // if (!avatar) {
    //   handleError("Avatar is required", "avatar");
    //   valid = false;
    // }

    if (valid) {
      register();
    }
  };

  const register = async () => {
    setLoader(true);
    try {
      await dispatch(registerUser(inputs));
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
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

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || inputs.dayOfBirth;
    // setShowDatePicker(Platform.OS === "ios");
    setShowDatePicker(false);
    setInputs((prevState) => ({ ...prevState, dayOfBirth: currentDate }));
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ marginHorizontal: 20 }}>
        <Loader visible={loader} />
        <KeyboardAvoidingView>
          <View>
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
            <Text style={styles.motto}>Tạo mới một tài khoản </Text>
            <Text style={styles.submotto}>
              {`Điền thông tin đầy đủ để tham gia vào HairHub với tư cách là ${email}`}
            </Text>
            <Input
              placeholder="Enter email"
              icon="email-outline"
              label="Email"
              value={inputs.email}
              error={errors.email}
              onFocus={() => handleError(null, "email")}
              onChangeText={(text) => handleChanges(text, "email")}
              editable={false}
            />
            <Input
              placeholder="Username"
              label="Username"
              icon="account-lock-outline"
              error={errors.username}
              onFocus={() => handleError(null, "username")}
              onChangeText={(text) => handleChanges(text, "username")}
            />

            <Input
              placeholder="Full Name"
              label="Full Name"
              icon="pen"
              error={errors.fullName}
              onFocus={() => handleError(null, "fullName")}
              onChangeText={(text) => handleChanges(text, "fullName")}
            />

            <Picker
              selectedValue={inputs.gender}
              onValueChange={(itemValue, itemIndex) =>
                handleChanges(itemValue, "gender")
              }
              items={["Male", "Female", "Other"]}
              label="Gender"
              error={errors.gender}
            />

            <Input
              placeholder="Phone"
              label="Phone"
              icon="phone"
              error={errors.phone}
              onFocus={() => handleError(null, "phone")}
              onChangeText={(text) => handleChanges(text, "phone")}
            />

            <View>
              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(true);
                }}
              >
                <Input
                  placeholder="Date of birth"
                  icon="calendar"
                  label="Date of birth"
                  value={inputs.dayOfBirth.toLocaleDateString()}
                  error={errors.dayOfBirth}
                  onFocus={() => handleError(null, "dayOfBirth")}
                  editable={false}
                  onPress={() => {
                    setShowDatePicker(true);
                  }}
                />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={inputs.dayOfBirth}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <Input
              placeholder="Password"
              icon="lock-outline"
              label="Password"
              error={errors.password}
              onFocus={() => handleError(null, "password")}
              onChangeText={(text) => handleChanges(text, "password")}
              password={true}
            />

            <Input
              placeholder="Confirm Password"
              icon="lock-outline"
              label="Confirm Password"
              error={errors.confirmPassword}
              onFocus={() => handleError(null, "confirmPassword")}
              onChangeText={(text) => setConfirmpassword(text)}
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

            <Button title="SIGN UP" onPress={validate} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
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
