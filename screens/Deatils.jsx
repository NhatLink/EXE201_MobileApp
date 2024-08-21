import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { baseUrl } from "../utils/IP";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS, SIZES, images } from "../constants";
import {
  SimpleLineIcons,
  Ionicons,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import { ColorList, StarRating } from "../components";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import addToCart from "../hook/addToCart";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { usePayment } from "../hook/PaymentContext";
import Toast from "react-native-toast-message";
import formatDate from "../utils/helper";
import { SliderBox } from "react-native-image-slider-box";
import TabViewComponent from "../components/Detail/TabViewComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeedbackBySalonInformationId,
  fetchSalonEmployeeBySalonInformationId,
  fetchSalonInformationById,
  fetchServiceHairBySalonInformationId,
} from "../store/salon/action";
import * as SecureStore from "expo-secure-store";
import Loader from "../components/auth/Loader";
const Details = ({ navigation }) => {
  const route = useRoute();
  const { product } = route.params;
  const [favorites, setFavorites] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const { setPaymentUrl } = usePayment();
  const dispatch = useDispatch();
  const { salonDetail, loading } = useSelector((state) => state.SALON);
  const { user, accessToken, refreshToken, isAuthenticated, accountId } =
    useSelector((state) => state.USER);
  useFocusEffect(
    useCallback(() => {
      checkFavorites();
      return () => {};
    }, [checkFavorites])
  );
  useEffect(() => {
    if (product) {
      dispatch(fetchSalonInformationById(product));
    }
  }, [product]);
  // console.log("salonDetail:", salonDetail);
  // console.log("salonService:", salonService);
  // console.log("salonEmployee:", salonEmployee);
  const checkFavorites = async () => {
    const userId = await SecureStore.getItemAsync("accountId");
    const favoritesId = `favorites${userId}`;
    try {
      const favoritesObj = await SecureStore.getItemAsync(favoritesId);
      if (favoritesObj !== null) {
        const favorites = JSON.parse(favoritesObj);
        if (favorites[product]) {
          setFavorites(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addFavorites = async () => {
    const userId = await SecureStore.getItemAsync("accountId");
    const favoritesId = `favorites${userId}`;
    let shopId = salonDetail?.id;
    let productObj = {
      address: salonDetail?.address,
      id: salonDetail?.id,
      description: salonDetail?.description,
      img: salonDetail?.img,
      isActive: salonDetail?.status,
    };

    try {
      const existingItem = await SecureStore.getItemAsync(favoritesId);
      let favoritesObj = existingItem ? JSON.parse(existingItem) : {};

      if (favoritesObj[product]) {
        // Key already exists, so delete it
        delete favoritesObj[shopId];

        // console.log(`Deleted key: ${shopId}`);
        setFavorites(false);
        // Toast.show({
        //   type: "info",
        //   text1: `${salonDetail?.name}`,
        //   text2: "Đã bị xóa khỏi danh sách yêu thích",
        //   visibilityTime: 4000, // thời gian hiển thị Toast (tính bằng ms)
        //   autoHide: true, // tự động ẩn Toast sau thời gian visibilityTime
        //   topOffset: 30, // vị trí từ đỉnh màn hình (tính bằng px)
        //   bottomOffset: 40, // vị trí từ đáy màn hình (tính bằng px)
        //   textStyle: { fontSize: 20 }, // kiểu chữ cho text2
        //   text1Style: { fontSize: 14, fontWeight: "bold" }, // kiểu chữ cho text1
        //   backgroundColor: "#2196F3", // màu nền của Toast
        //   onPress: () => console.log("Toast pressed"), // hàm sẽ được gọi khi người dùng nhấn vào Toast
        // });
        ToastAndroid.show(
          "Đã xóa khỏi danh sách yêu thích",
          ToastAndroid.SHORT
        );
      } else {
        favoritesObj[shopId] = productObj;
        setFavorites(true);
        ToastAndroid.show(
          "Được thêm vào danh sách yêu thích",
          ToastAndroid.SHORT
        );
      }

      await SecureStore.setItemAsync(favoritesId, JSON.stringify(favoritesObj));
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Đang lấy dữ liệu, xin chờ</Text>
      </SafeAreaView>
    );
  }

  if (salonDetail.status !== "APPROVED") {
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          // visible={checkInStatus}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Salon/Barber hiện không còn nhận đặt lịch{" "}
              </Text>
              <Ionicons name="ban-outline" size={100} color={COLORS.primary} />
              <Text style={styles.modalText}>
                Vui lòng thử lại sau! Xin cảm ơn
              </Text>

              <View style={styles.containerInfo}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.button1}>Trở về</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={CheckIn}>
                  <Text style={styles.button1}>Check In</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <Loader visible={loading} /> */}
      <ScrollView style={styles.wrapper}>
        <View style={styles.upperRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-circle"
              size={40}
              color={COLORS.offwhite}
            />
          </TouchableOpacity>
          <View style={styles.ratingContainer}>
            {/* <StarRating rating={item?.avgRating} /> */}
            <Text style={styles.averageRatingText}>
              {salonDetail?.rate > 0
                ? (salonDetail?.rate).toFixed(1) + "/5.0"
                : "Không có đánh giá"}
            </Text>
            <Text style={styles.averageRatingText}>
              {salonDetail?.totalReviewer
                ? salonDetail?.totalReviewer + " đánh giá"
                : "(0 đánh giá)"}
            </Text>
          </View>
        </View>
        <View style={styles.details}>
          {salonDetail?.img ? (
            <Image source={{ uri: salonDetail?.img }} style={styles.image} />
          ) : (
            // <View style={styles.carouselContainer}>
            //   <SliderBox
            //     images={salonDetail?.img}
            //     dotColor={COLORS.primary}
            //     inactiveDotColor={COLORS.secondary}
            //     ImageComponentStyle={{
            //       borderRadius: 15,
            //       width: "93%",
            //       marginTop: 15,
            //     }}
            //     autoplay
            //     circleLoop
            //   />
            // </View>
            <Text>No image available</Text>
          )}
        </View>
        <View style={styles.descriptionWrapper}>
          <View>
            <Text style={styles.description}>{salonDetail?.name}</Text>
            <Text style={styles.descriptionText}>
              {salonDetail?.description}
            </Text>
            <Text style={styles.descriptionText}>
              Địa chỉ: {salonDetail?.address}
            </Text>
            {/* {StoreDetail?.saleUp && (
              <Text style={styles.sale} numberOfLines={1}>
                SALE
              </Text>
            )} */}
            {isAuthenticated && (
              <View style={styles.authContainer}>
                <TouchableOpacity onPress={addFavorites}>
                  {favorites ? (
                    <Ionicons name="heart" size={40} color="red" />
                  ) : (
                    <Ionicons
                      name="heart-outline"
                      size={40}
                      color={COLORS.black}
                    />
                  )}
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => navigation.navigate("Chat")}
                >
                  <Ionicons
                    name="chatbox-ellipses-outline"
                    size={35}
                    color={COLORS.black}
                  />
                </TouchableOpacity> */}
              </View>
            )}
          </View>
        </View>
        <TabViewComponent storeId={salonDetail?.id} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webView: {
    height: "100%",
    width: "100%",
  },
  wrapper: {
    flex: 1,
    // backgroundColor: COLORS.lightWhite,
    // marginTop: SIZES.small,
  },
  location: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    padding: 5,
    borderRadius: SIZES.xLarge,
  },
  upperRow: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    width: SIZES.width - 30,
    top: 5,
    zIndex: 999,
  },
  details: {
    marginTop: -SIZES.large,
    width: SIZES.width,
    borderTopLeftRadius: SIZES.medium,
    borderTopRightRadius: SIZES.medium,
  },
  rating: {
    top: SIZES.large,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: SIZES.large,
  },
  description: {
    fontFamily: "bold",
    fontSize: SIZES.large - 2,
  },
  descriptionWrapper: {
    marginTop: SIZES.large,
    marginHorizontal: SIZES.large,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  descriptionText: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    textAlign: "justify",
    marginBottom: SIZES.small,
  },
  carouselContainer: {
    marginTop: SIZES.large,
    flex: 1,
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "column",
    backgroundColor: COLORS.secondary,
    // position: "absolute",
    // top: 0,
    // right: 0,
    borderTopEndRadius: 10,
    borderBottomStartRadius: 10,
    padding: 5,
  },
  averageRatingText: {
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    fontSize: SIZES.small,
  },
  sale: {
    fontSize: SIZES.medium,
    fontFamily: "bold",
    color: COLORS.black,
    backgroundColor: COLORS.tertiary,
    borderRadius: 5,
    overflow: "hidden",
    maxWidth: 80,
    textAlign: "center",
  },
  image: {
    aspectRatio: 1,
    resizeMode: "cover",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: COLORS.background,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
  containerInfo: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5,
  },
  button1: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: "bold",
    color: COLORS.lightWhite,
  },
  authContainer: {
    // marginTop: SIZES.large,
    // marginHorizontal: SIZES.large,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default Details;
