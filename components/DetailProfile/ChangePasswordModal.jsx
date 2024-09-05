import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  ToastAndroid,
  Keyboard,
} from "react-native";
import ButtonCustom from "../auth/Button";
import { COLORS, SIZES } from "../../constants";
import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  AntDesign,
  Ionicons,
} from "react-native-vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../auth/Loader";
import { updatePasswordUserById } from "../../store/user/action";

const ChangePasswordModal = ({ isVisible, onClose, data }) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [oldpassword, setOldpassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [oldpasswordError, setOldpasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [newPassword2Error, setNewPassword2Error] = useState("");
  const { user, accountId } = useSelector((state) => state.USER);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);

  const updatePassword = async () => {
    Keyboard.dismiss();
    // Kiểm tra nếu oldpassword trống
    if (!oldpassword) {
      setOldpasswordError("Mật khẩu cũ không được để trống");
      return;
    }

    // Regular expression kiểm tra mật khẩu (8 ký tự, chữ cái đầu viết hoa, ít nhất 1 chữ số)
    const passwordRegex = /^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{8,30}$/;

    // Kiểm tra mật khẩu mới
    if (!newPassword) {
      setNewPasswordError("Mật khẩu mới không được để trống");
      return;
    } else if (newPassword.length < 8) {
      setNewPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    } else if (newPassword.length > 30) {
      setNewPasswordError("Mật khẩu mới không được quá 30 ký tự");
      return;
    } else if (!/[A-Z]/.test(newPassword)) {
      setNewPasswordError("Mật khẩu mới phải có ít nhất một chữ cái viết hoa");
      return;
    } else if (!/\d/.test(newPassword)) {
      setNewPasswordError("Mật khẩu mới phải có ít nhất một chữ số");
      return;
    } else if (newPassword === oldpassword) {
      setNewPasswordError(
        "Mật khẩu mới giống với mật khẩu cũ! Hãy kiểm tra lại"
      );
      return;
    }

    // Kiểm tra mật khẩu nhập lại
    if (!newPassword2) {
      setNewPassword2Error("Mật khẩu nhập lại không được để trống");
      return;
      // } else if (newPassword2.length < 8) {
      //   setNewPassword2Error("Mật khẩu nhập lại phải có ít nhất 8 ký tự");
      //   return;
      // } else if (newPassword2.length > 30) {
      //   setNewPassword2Error("Mật khẩu nhập lại không được quá 30 ký tự");
      //   return;
      // } else if (!/[A-Z]/.test(newPassword2)) {
      //   setNewPassword2Error(
      //     "Mật khẩu nhập lại phải có ít nhất một chữ cái viết hoa"
      //   );
      //   return;
      // } else if (!/\d/.test(newPassword2)) {
      //   setNewPassword2Error("Mật khẩu nhập lại phải có ít nhất một chữ số");
      //   return;
    } else if (newPassword !== newPassword2) {
      setNewPassword2Error("Mật khẩu nhập lại không khớp với mật khẩu mới");
      return;
    }

    setLoader(true);
    try {
      // let formData = new FormData();
      let dataSubmit = {
        currentPassword: oldpassword,
        newPassword: newPassword,
        confirmNewPassword: newPassword2,
      };
      if (accountId) {
        // console.log(accountId);
        // console.log(dataSubmit);
        await dispatch(updatePasswordUserById(accountId, dataSubmit));
      } else {
        ToastAndroid.show(
          "Có lỗi xảy ra, vui lòng thử lại sau",
          ToastAndroid.SHORT
        );
        return;
      }
    } catch (error) {
      console.error("CreateFeedback error:", error);
      Alert.alert("Lỗi", "Oops, có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setLoader(false);
      onClose();
      setNewPassword("");
      setNewPassword2("");
      setOldpassword("");
      setNewPassword2Error("");
      setNewPasswordError("");
      setOldpasswordError("");
      // setTitle(new Date().toLocaleDateString());
      // setNotes(
      //   `Bộ sưu tập lưu trữ vào ngày ${new Date().toLocaleDateString()}`
      // );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      // onRequestClose={onClose}
      onRequestClose={loader ? null : onClose}
    >
      <Loader visible={loader} />
      <ScrollView style={styles.fullScreenModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Thay đổi mật khẩu</Text>
          <View style={styles.line} />

          <Text style={styles.modalText}>Mật khẩu hiện tại:</Text>
          <View style={styles.searchContainerTitle}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                style={styles.searchIcon}
                name="account-key"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <View style={styles.searchWrapper}>
              <TextInput
                style={styles.searchInput}
                value={oldpassword}
                onChangeText={(text) => {
                  setOldpassword(text);
                  setOldpasswordError("");
                }}
                placeholder="Nhập mật khẩu hiện tại"
                secureTextEntry={!isPasswordVisible}
              />
            </View>
            {oldpassword && (
              <TouchableOpacity onPress={() => setOldpassword("")}>
                <Ionicons
                  style={styles.deleteIcon}
                  name="close-circle-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons
                style={styles.deleteIcon}
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {oldpasswordError ? (
            <Text
              style={{ color: "red", marginLeft: 20, fontSize: SIZES.small }}
            >
              {oldpasswordError}
            </Text>
          ) : null}

          <Text style={styles.modalText}>Mật khẩu mới:</Text>
          <View style={styles.searchContainerTitle}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                style={styles.searchIcon}
                name="account-lock"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <View style={styles.searchWrapper}>
              <TextInput
                style={styles.searchInput}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setNewPasswordError("");
                }}
                placeholder="Nhập mật khẩu mới"
                secureTextEntry={!isPasswordVisible1}
              />
            </View>
            {newPassword && (
              <TouchableOpacity onPress={() => setNewPassword("")}>
                <Ionicons
                  style={styles.deleteIcon}
                  name="close-circle-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setIsPasswordVisible1(!isPasswordVisible1)}
            >
              <Ionicons
                style={styles.deleteIcon}
                name={isPasswordVisible1 ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {newPasswordError ? (
            <Text
              style={{ color: "red", marginLeft: 20, fontSize: SIZES.small }}
            >
              {newPasswordError}
            </Text>
          ) : null}

          <Text style={styles.modalText}>Nhập lại mật khẩu mới:</Text>
          <View style={styles.searchContainerTitle}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                style={styles.searchIcon}
                name="account-lock"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <View style={styles.searchWrapper}>
              <TextInput
                style={styles.searchInput}
                value={newPassword2}
                onChangeText={(text) => {
                  setNewPassword2(text);
                  setNewPassword2Error("");
                }}
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry={!isPasswordVisible2}
              />
            </View>
            {newPassword2 && (
              <TouchableOpacity onPress={() => setNewPassword2("")}>
                <Ionicons
                  style={styles.deleteIcon}
                  name="close-circle-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setIsPasswordVisible2(!isPasswordVisible2)}
            >
              <Ionicons
                style={styles.deleteIcon}
                name={isPasswordVisible2 ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {newPassword2Error ? (
            <Text
              style={{ color: "red", marginLeft: 20, fontSize: SIZES.small }}
            >
              {newPassword2Error}
            </Text>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.submitButton}>
        <ButtonCustom title={"Cập nhật mật khẩu"} onPress={updatePassword} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenModal: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalContent: {
    flex: 1,
    justifyContent: "flex-start",
    // alignItems: "flex-start",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  modalTitle: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 18,
    textAlign: "left",
    marginHorizontal: 5,
    fontWeight: "bold",
  },
  modalSubText: {
    fontSize: 14,
    textAlign: "left",
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginVertical: 20,
  },
  buttonrright: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderLeftWidth: 0.5,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonleft: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    borderWidth: 2,
    borderRightWidth: 0.5,
    borderColor: COLORS.primary,
  },
  //   button: {
  //     flexDirection: "row",
  //     justifyContent: "center",
  //     alignContent: "center",
  //     textAlign: "center",
  //     backgroundColor: COLORS.secondary,
  //     padding: 10,
  //     borderRadius: 15,
  //     borderWidth: 2,
  //     borderColor: COLORS.primary,
  //   },
  buttonText: {
    color: COLORS.black,
    fontSize: 15,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Cho phép các hình ảnh tự động xuống dòng khi quá 3 tấm
    justifyContent: "flex-start", // Căn các ảnh về đầu hàng
    alignItems: "center",
    marginVertical: 10,
  },
  imageWrapper: {
    position: "relative",
    marginHorizontal: 5,
    marginBottom: 10, // Thêm khoảng cách giữa các hàng
    width: "30%", // Đặt chiều rộng cho mỗi hình ảnh để chia đều trong 3 hàng
  },
  image: {
    width: "100%", // Đảm bảo hình ảnh chiếm hết chiều rộng của imageWrapper
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
  },
  line: {
    padding: 1,
    backgroundColor: COLORS.gray2,
    marginVertical: 10,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: COLORS.cardcolor,
    borderRadius: SIZES.small,
    height: 150,
    paddingVertical: 5,
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  searchContainerTitle: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: COLORS.cardcolor,
    borderRadius: SIZES.xSmall,
    marginVertical: 10,
    paddingVertical: 5,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  searchWrapper: {
    flex: 1,
    marginRight: SIZES.xSmall,
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    borderRadius: SIZES.small,
    // height: "100%",
  },
  searchInput: {
    fontWeight: "normal",
    color: COLORS.black,
    paddingHorizontal: SIZES.xSmall,
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
  button: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: "bold",
  },
  submitButton: {
    position: "absolute",
    bottom: 5,
    width: SIZES.width - 40,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#f5f5f5",
  },
});

export default ChangePasswordModal;
