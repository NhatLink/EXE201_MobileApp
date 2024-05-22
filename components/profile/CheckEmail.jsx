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
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, images } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../../utils/helper";
import OrderTile from "../orders/OrderTile";
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons, Feather } from "@expo/vector-icons";
const CheckEmail = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [userHaveAccount, setUserHaveAccount] = useState(true);

  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleContinuePress = () => {
    if (!email) {
      setEmailError("Email không được để trống");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ");
      return;
    }
    setEmailError("");

    if (userHaveAccount) {
      navigation.navigate("Login", { email: email });
    } else {
      navigation.navigate("SignIn", { email: email });
    }
  };
  return (
    <View style={styles.container2}>
      <View>
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
        <TouchableOpacity onPress={handleContinuePress}>
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
