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
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, images } from "../constants";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../utils/helper";
import OrderTile from "../components/orders/OrderTile";
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  checkExistEmail,
  checkOtp,
  sendOtpEmail,
  resetCheckOtp,
} from "../store/otp/action";
import { useEffect } from "react";
import Loader from "../components/auth/Loader";
const CheckEmail = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [userHaveAccount, setUserHaveAccount] = useState(false);
  const [modalOtp, setModalOtp] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [otp, setOtp] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [resetButton, setResetButton] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, emailExists, CheckOtp } = useSelector(
    (state) => state.OTP
  );
  useEffect(() => {
    let timer;
    if (modalOtp) {
      setCountdown(120); // Set initial countdown time to 2 minutes (120 seconds)
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setModalOtp(false);
            setResetButton(true);
            return null;
          } else {
            return prevCountdown - 1; // Otherwise, decrease the countdown
          }
        });
      }, 1000); // Update countdown every second
    } else {
      setCountdown(null); // Reset countdown when modal is closed
    }
    // Clean up function
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [modalOtp]);

  // Convert countdown time to minutes and seconds for display
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  useEffect(() => {
    if (emailExists === true) {
      setModalOtp(true);
    }
  }, [emailExists]);

  useEffect(() => {
    if (CheckOtp === true) {
      setModalOtp(false);
      setResetButton(false);
      setOtp(null);
      setEmail(null);
      navigation.navigate("Signup", { email: email });
    }
  }, [CheckOtp]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleContinuePress = async () => {
    // await dispatch(resetCheckOtp());
    await handleModalClose();
    if (!email) {
      setEmailError("Email không được để trống");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ");
      return;
    }
    if (error) {
      setEmailError(error);
    }
    setEmailError("");

    try {
      await dispatch(
        checkExistEmail(
          { email },
          {
            email: email,
            fullName: email,
          }
        )
      );
    } catch (error) {
      // If checkExistEmail throws an error (status code 404), it means the email doesn't exist
      setUserHaveAccount(true);
      console.log(error);
      // No need to dispatch sendOtpEmail here as it's already dispatched in the checkExistEmail action
    }
  };

  const handleSubmitOTP = async () => {
    if (!otp) {
      ToastAndroid.show("Vui lòng nhập otp", ToastAndroid.SHORT);
      return;
    }
    try {
      await dispatch(
        checkOtp({
          otpRequest: otp,
          email: email,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleModalClose = () => {
    // Reset all OTP-related states and dispatch Redux action
    console.log("handleModalClose");
    setModalOtp(false);
    dispatch(resetCheckOtp());
  };
  return (
    <View style={styles.container2}>
      <Loader visible={loading} />
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
        <Text style={styles.title2}>Chào mừng đến với HairHub</Text>
        <Text style={styles.subtitle2}>
          Tạo tài khoản hoặc đăng nhập để đặt lịch và quản lý các cuộc hẹn của
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
              value={email}
              placeholder="Email?"
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(""); // Clear error when user starts typing
              }}
            />
          </View>
          {email && (
            <TouchableOpacity onPress={() => setEmail("")}>
              <Ionicons
                style={styles.deleteIcon}
                name="close-circle-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          )}
        </View>
        {emailError ? (
          <Text style={{ color: "red", marginTop: 5, marginHorizontal: 20 }}>
            {emailError}
          </Text>
        ) : null}
        {resetButton ? (
          <TouchableOpacity onPress={handleContinuePress}>
            <Text style={styles.button}>Thử lại</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleContinuePress}>
            <Text style={styles.button}>Tiếp tục</Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalOtp}
        // onRequestClose={handleModalClose}
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTextTitle}>Nhập OTP</Text>
            {countdown !== null && (
              <Text style={styles.modalTextTitle}>
                Thời gian còn lại: {minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </Text>
            )}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={otp}
                placeholder="OTP"
                keyboardType="number-pad"
                onChangeText={(text) => {
                  setOtp(text);
                  setEmailError(""); // Clear error when user starts typing
                }}
              />
            </View>
            <TouchableOpacity onPress={handleSubmitOTP}>
              <Text style={styles.button1}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckEmail;

const styles = StyleSheet.create({
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
