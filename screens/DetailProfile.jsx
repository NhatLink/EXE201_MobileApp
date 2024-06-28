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
  Modal,
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
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { updateUserById } from "../store/user/action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import Loader from "../components/auth/Loader";
const DetailProfile = ({ navigation }) => {
  // const user = useSelector((state) => state.USER.user);
  const { user, accountId } = useSelector((state) => state.USER);
  const [idUser, setIdUser] = useState(null);
  // const navigation = useNavigation();
  // const [userData, setUserData] = useState({
  //   roleId: userInfo?.roleId,
  //   username: userInfo?.username,
  //   password: userInfo?.password,
  //   fullName: userInfo?.fullName,
  //   dayOfBirth: userInfo?.dayOfBirth,
  //   gender: userInfo?.gender,
  //   email: userInfo?.email,
  //   phone: userInfo?.phone,
  //   address: userInfo?.address,
  //   img: userInfo?.img,
  //   bankAccount: userInfo?.bankAccount,
  //   bankName: userInfo?.bankName,
  // });
  const [userData, setUserData] = useState(user);
  const [modalAvatar, setModalAvatar] = useState(false);
  const [modalFullname, setModalFullname] = useState(false);
  const [modalPhone, setModalPhone] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fullname, setFullname] = useState(user?.fullName);
  const [phone, setPhone] = useState(user?.email);
  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      setLoader(true);
      const accountId = await SecureStore.getItemAsync("accountId");
      const userInfoJson = await SecureStore.getItemAsync("userInfo");
      let userInfo = null;
      if (userInfoJson) {
        try {
          userInfo = JSON.parse(userInfoJson);
        } catch (error) {
          console.error("Error parsing userInfo", error);
        }
      }
      setUserData(userInfo);
      // setFullname(userInfo?.fullName);
      // setPhone(userInfo?.phone);
      setIdUser(accountId);
      setLoader(false);
    }

    fetchData();
  }, []);
  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData((prevState) => ({
        ...prevState,
        img: result.assets[0].uri,
      }));
      setModalAvatar(false);
    }
  };

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData((prevState) => ({
        ...prevState,
        img: result.assets[0].uri,
      }));
      setModalAvatar(false);
    }
  };
  const handleChanges = (text, input) => {
    setUserData((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };
  const handleChangeFullName = () => {
    if (!fullname) {
      handleError("Full name is required", "fullname");
    } else if (fullname.length < 3) {
      handleError("Full name must be at least 3 characters", "fullname");
    } else if (fullname.length > 40) {
      handleError("Full name must be less than 40 characters", "fullname");
    } else {
      setModalFullname(false);
      handleChanges(fullname, "fullName");
      handleError(null, "fullname");
    }
  };
  const handleChangeEmail = () => {
    if (!phone) {
      // handleError("Phone is required", "phone");
      handleError("Email is required", "phone");
    }
    // else if (!phone.match(/^[0-9]{10}$/)) {
    //   handleError(
    //     "Provide a valid phone number with exactly 10 digits",
    //     "phone"
    //   );
    // }
    else if (!phone.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      handleError("Provide a valid email address", "phone");
    } else {
      setModalPhone(false);
      handleChanges(phone, "email");
      handleError(null, "phone");
    }
  };
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || userData?.dayOfBirth;
    const formattedDate = currentDate.toISOString().slice(0, 19);
    setShowDatePicker(false);
    setUserData((prevState) => ({ ...prevState, dayOfBirth: formattedDate }));
  };
  const isDifferent = JSON.stringify(user) !== JSON.stringify(userData);

  console.log("userData:", JSON.stringify(userData));
  console.log("user:", JSON.stringify(user));
  console.log("isDifferent", isDifferent);
  const handlePressBack = () => {
    if (isDifferent) {
      Alert.alert(
        "Những thông tin bạn thay đổi sẽ không được lưu",
        "Bạn muốn quay về chứ?",
        [
          {
            text: "Hủy",
            style: "cancel",
          },
          {
            text: "Tiếp tục",
            onPress: () => {
              setUserData(user);
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const updateUser = async () => {
    setLoader(true);
    try {
      let formData = new FormData();

      // Loop through each key in data object
      for (let key in userData) {
        if (key === "img") {
          const uriParts = userData[key]?.split(".");
          const fileType = uriParts[uriParts.length - 1];

          formData.append(key, {
            uri: userData[key],
            name: `image.${fileType}`,
            type: `image/${fileType}`,
          });
        } else {
          formData.append(key, userData[key]);
        }
      }
      console.log("userformdataUpdate:", formData);
      // Dispatching the loginUser action with formData
      await dispatch(updateUserById(idUser, formData));
      // Handling post-login logic can be done within the loginUser action or here
    } catch (error) {
      console.error("updateUserById error:", error);
      Alert.alert("Error", "Oops, something went wrong. Try again");
    } finally {
      setLoader(false);
      navigation.navigate("Profile");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loader} />
      <Text style={styles.modalTextTitle}>Chỉnh sửa thông tin người dùng</Text>
      <TouchableOpacity
        style={styles.maiImag2}
        onPress={() => {
          setModalAvatar(true);
        }}
      >
        <View style={styles.containerUser}>
          <Image
            source={{
              uri: userData?.img,
            }}
            resizeMode="cover"
            style={styles.avatar}
          />
          {/* <View>
            <Text style={styles.title}>Sửa</Text>
          </View> */}
        </View>
        <Text style={styles.subtitle}>Chạm để sửa</Text>
      </TouchableOpacity>
      <View style={styles.menuWrapper}>
        {/* <TouchableOpacity onPress={() => {}}>
          <View style={styles.menuItem}>
            <View style={styles.menuItem2}>
              <MaterialCommunityIcons
                name="rename-box"
                color={COLORS.primary}
                size={25}
              />
              <Text style={styles.menuItemText}>Tên</Text>
            </View>
            <Text style={styles.menuItemText}>
              {userData?.username ?? "trống"}
            </Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            setModalFullname(true);
          }}
        >
          <View style={styles.menuItem}>
            <View style={styles.menuItem2}>
              <MaterialCommunityIcons
                name="rename-box"
                color={COLORS.primary}
                size={25}
              />
              <Text style={styles.menuItemText}>Họ Tên</Text>
            </View>
            <Text style={styles.menuItemText}>
              {userData?.fullName ?? "trống"}
            </Text>
          </View>
        </TouchableOpacity>
        <View>
          <View style={styles.menuItem1}>
            <View style={styles.menuItem2}>
              <MaterialCommunityIcons
                name="gender-male-female"
                color={COLORS.primary}
                size={25}
              />
              <Text style={styles.menuItemText}>Giới tính</Text>
            </View>
            <View style={styles.menuItem2}>
              <Text style={styles.menuItemText}>
                {userData?.gender ?? "trống"}
              </Text>
              <Picker
                selectedValue={userData?.gender}
                onValueChange={(itemValue, itemIndex) =>
                  handleChanges(itemValue, "gender")
                }
                style={styles.picker}
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Orther" value="Orther" />
              </Picker>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true);
          }}
        >
          <View style={styles.menuItem}>
            <View style={styles.menuItem2}>
              <MaterialCommunityIcons
                name="calendar-today"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.menuItemText}>Ngày sinh</Text>
            </View>
            <Text style={styles.menuItemText}>
              {userData?.dayOfBirth?.split("T")[0] ?? "trống"}
              {/* {userData?.dayOfBirth} */}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <View style={styles.menuItem}>
            <View style={styles.menuItem2}>
              <MaterialCommunityIcons
                name="phone"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.menuItemText}>Số điện thoại</Text>
            </View>
            <Text style={styles.menuItemText}>
              {userData?.phone ?? "trống"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalPhone(true)}>
          <View style={styles.menuItem}>
            <View style={styles.menuItem2}>
              <MaterialCommunityIcons
                name="email"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.menuItemText}>Email</Text>
            </View>
            <Text style={styles.menuItemText} numberOfLines={1}>
              {userData?.email ?? "trống"}
            </Text>
          </View>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAvatar}
          onRequestClose={() => {
            setModalAvatar(false);
          }}
        >
          <View style={styles.fullScreenModal}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTextTitle}>Chọn Avatar</Text>
              <View style={styles.avatarButtonContainer}>
                <TouchableOpacity
                  style={styles.buttonAvatar}
                  onPress={pickImageFromGallery}
                >
                  <Text>Chọn Ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonAvatar}
                  onPress={pickImageFromCamera}
                >
                  <Text>Chụp Ảnh</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.buttonCloseModal}
                onPress={() => {
                  setModalAvatar(false);
                }}
              >
                <Ionicons
                  style={styles.textStyle}
                  name="return-up-back"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalFullname}
          onRequestClose={() => {
            setModalFullname(false);
          }}
        >
          <View style={styles.fullScreenModal1}>
            <View style={styles.modalText}>
              <TouchableOpacity
                onPress={() => {
                  setModalFullname(false);
                }}
              >
                <Ionicons
                  style={styles.textStyle}
                  name="return-up-back"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <Text style={styles.modalTextTitle}>Chỉnh sửa tên</Text>
            </View>
            <View style={styles.searchContainer}>
              {/* <TouchableOpacity>
                <Feather
                  style={styles.searchIcon}
                  name="scissors"
                  size={24}
                  color="black"
                />
              </TouchableOpacity> */}
              <View style={styles.searchWrapper}>
                <TextInput
                  style={styles.searchInput}
                  value={fullname}
                  onChangeText={(text) => setFullname(text)}
                  placeholder="Họ và tên"
                  onFocus={() => {
                    handleError(null, "fullname");
                  }}
                />
              </View>

              <TouchableOpacity
                style={styles.searchBtn}
                onPress={handleChangeFullName}
              >
                {/* <Ionicons
                  name="search"
                  size={SIZES.xLarge}
                  color={COLORS.offwhite}
                /> */}
                <Text style={styles.searchText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
            {errors.fullname && (
              <Text style={styles.erroMsg}>{errors.fullname}</Text>
            )}
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalPhone}
          onRequestClose={() => {
            setModalPhone(false);
          }}
        >
          <View style={styles.fullScreenModal1}>
            <View style={styles.modalText}>
              <TouchableOpacity
                onPress={() => {
                  setModalPhone(false);
                }}
              >
                <Ionicons
                  style={styles.textStyle}
                  name="return-up-back"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <Text style={styles.modalTextTitle}>Chỉnh sửa Email</Text>
            </View>

            <View style={styles.searchContainer}>
              {/* <TouchableOpacity>
                <Feather
                  style={styles.searchIcon}
                  name="scissors"
                  size={24}
                  color="black"
                />
              </TouchableOpacity> */}
              <View style={styles.searchWrapper}>
                <TextInput
                  style={styles.searchInput}
                  value={phone}
                  // keyboardType="number-pad"
                  onChangeText={(text) => setPhone(text)}
                  placeholder="Email"
                  onFocus={() => {
                    handleError(null, "phone");
                  }}
                />
              </View>
              <TouchableOpacity
                style={styles.searchBtn}
                onPress={handleChangeEmail}
              >
                {/* <Ionicons
                  name="search"
                  size={SIZES.xLarge}
                  color={COLORS.offwhite}
                /> */}
                <Text style={styles.searchText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
            {errors.phone && <Text style={styles.erroMsg}>{errors.phone}</Text>}
          </View>
        </Modal>
        {showDatePicker && (
          <DateTimePicker
            // value={userData.dayOfBirth}
            value={new Date(userData?.dayOfBirth ?? "trống")}
            mode="date"
            display="default"
            onChange={onChangeDate}
            maximumDate={new Date()}
          />
        )}
      </View>
      <TouchableOpacity style={styles.buttonClose} onPress={handlePressBack}>
        <Ionicons
          style={styles.textStyle}
          name="return-up-back"
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {isDifferent && (
        <TouchableOpacity style={styles.buttonConfirm} onPress={updateUser}>
          <Ionicons
            style={styles.textStyle}
            name="checkmark-outline"
            size={24}
            color="red"
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default DetailProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    paddingTop: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: SIZES.medium,
    marginHorizontal: 10,
  },
  subtitle: {
    fontWeight: "normal",
    textAlign: "center",
    fontSize: SIZES.small,
    backgroundColor: COLORS.gray2,
  },
  containerUser: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 999,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  maiImag2: {
    height: 200,
    width: "100%",
    backgroundColor: COLORS.secondary,
  },
  menuWrapper: {
    marginTop: SIZES.xLarge,
    width: "auto",
    marginHorizontal: 10,
    backgroundColor: COLORS.offwhite,
    borderRadius: 12,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 0.5,
  },
  menuItem1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
    paddingLeft: 30,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 0.5,
  },
  menuItem2: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  menuItemText: {
    fontFamily: "regular",
    color: COLORS.gray,
    marginLeft: 10,
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 26,
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
    marginVertical: 10,
    marginLeft: 10,
  },
  modalText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonClose: {
    position: "absolute",
    top: 20,
    left: 10,
    padding: 10,
  },
  buttonConfirm: {
    position: "absolute",
    top: 20,
    right: 10,
    padding: 10,
    // backgroundColor: COLORS.red,
    borderRadius: 10,
  },
  buttonCloseModal: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
  },
  avatarButtonContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  buttonAvatar: {
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 20,
  },
  picker: {
    backgroundColor: COLORS.offwhite,
    height: 15,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    marginLeft: 10,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginTop: SIZES.small,
    height: 50,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    marginRight: SIZES.xSmall,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.small,
    height: "100%",
  },
  searchInput: {
    fontFamily: "regular",
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.xSmall,
  },
  searchBtn: {
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  searchText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: SIZES.medium,
    marginVertical: 10,
    color: COLORS.lightWhite,
  },
  searchIcon: {
    marginLeft: 10,
    color: "gray",
  },
  erroMsg: {
    color: COLORS.red,
    marginTop: 6,
    marginLeft: 5,
    fontFamily: "regular",
    fontSize: SIZES.xSmall,
  },
});
