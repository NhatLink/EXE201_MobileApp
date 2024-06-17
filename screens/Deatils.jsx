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
import useUser from "../hook/useUser";
import axios from "axios";
import { usePayment } from "../hook/PaymentContext";
import Toast from "react-native-toast-message";
import formatDate from "../utils/helper";
import { SliderBox } from "react-native-image-slider-box";
import TabViewComponent from "../components/Detail/TabViewComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalonInformationById } from "../store/salon/action";
import * as SecureStore from "expo-secure-store";
import Loader from "../components/auth/Loader";
const Details = ({ navigation }) => {
  const StoreDetail = {
    storeId: 123,
    storeName: "Barber's Haven",
    location: "123 Phố Đông, Quận 1, Hà Nội",
    averageRating: 4.5,
    totalReviews: 120,
    phoneNumber: "0123456789",
    saleUp: true,
    services: [
      {
        serviceName: "Basic Haircut",
        description: "Quick and suitable haircut for all ages.",
        price: 150000,
        serviceTime: "30 minutes",
      },
      {
        serviceName: "Shaving",
        description: "Facial shave with a special razor, includes skin care.",
        price: 100000,
        serviceTime: "15 minutes",
      },
      {
        serviceName: "Hair Coloring",
        description:
          "Hair dyeing with fashionable colors, protects hair and scalp.",
        price: 500000,
        serviceTime: "90 minutes",
      },
      {
        serviceName: "Hair Care",
        description:
          "Thorough hair care service, includes wash, rinse, and head massage.",
        price: 200000,
        serviceTime: "45 minutes",
      },
    ],
    reviews: [
      {
        reviewerName: "Nguyễn Văn A",
        reviewerAvatar: "avatar1.png",
        reviewDate: "2024-05-01",
        stars: 5,
        serviceUsed: "Shaving",
        review: "Very satisfied with the service, friendly staff.",
      },
      {
        reviewerName: "Trần Thị B",
        reviewerAvatar: "avatar2.png",
        reviewDate: "2024-04-20",
        stars: 4,
        serviceUsed: "Hair Care",
        review: "Good service but a bit of a wait.",
      },
    ],
    images: [
      "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-tao-kieu-toc-1024x642.jpg",

      "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-cat-toc-1024x642.jpg",

      "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-duoi-toc-1024x642.jpg",
    ],
    workingDays: [
      {
        dayOfWeek: "Monday",
        status: "Open",
        openTime: "9:00",
        closeTime: "19:00",
      },
      {
        dayOfWeek: "Tuesday",
        status: "Open",
        openTime: "9:00",
        closeTime: "19:00",
      },
      {
        dayOfWeek: "Wednesday",
        status: "Closed",
        openTime: "-",
        closeTime: "-",
      },
      {
        dayOfWeek: "Thursday",
        status: "Open",
        openTime: "9:00",
        closeTime: "19:00",
      },
      {
        dayOfWeek: "Friday",
        status: "Open",
        openTime: "9:00",
        closeTime: "21:00",
      },
    ],
    amenities: {
      freeParking: true,
      parkingAvailable: true,
      security: true,
    },
  };

  const route = useRoute();
  const { product } = route.params;
  const [favorites, setFavorites] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const userLogin = useUser(navigation);
  const { setPaymentUrl } = usePayment();
  console.log("idUser", idUser);
  const dispatch = useDispatch();
  const { salonService, salonDetail, salonEmployee } = useSelector(
    (state) => state.SALON
  );
  useFocusEffect(
    useCallback(() => {
      checkFavorites();
      return () => {};
    }, [checkFavorites])
  );
  useEffect(() => {
    async function fetchData() {
      setLoader(true);
      const accountId = await SecureStore.getItemAsync("accountId");
      dispatch(fetchSalonInformationById(product));
      setIdUser(accountId);
      setLoader(false);
    }

    fetchData();
  }, []);
  console.log("salonDetail:", salonDetail);
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
      isActive: salonDetail?.isActive,
    };

    try {
      const existingItem = await SecureStore.getItemAsync(favoritesId);
      let favoritesObj = existingItem ? JSON.parse(existingItem) : {};

      if (favoritesObj[product]) {
        // Key already exists, so delete it
        delete favoritesObj[shopId];

        console.log(`Deleted key: ${shopId}`);
        setFavorites(false);
        Toast.show({
          type: "info",
          text1: `${salonDetail?.description}`,
          text2: "Đã bị xóa khỏi danh sách yêu thích",
          visibilityTime: 4000, // thời gian hiển thị Toast (tính bằng ms)
          autoHide: true, // tự động ẩn Toast sau thời gian visibilityTime
          topOffset: 30, // vị trí từ đỉnh màn hình (tính bằng px)
          bottomOffset: 40, // vị trí từ đáy màn hình (tính bằng px)
          textStyle: { fontSize: 20 }, // kiểu chữ cho text2
          text1Style: { fontSize: 14, fontWeight: "bold" }, // kiểu chữ cho text1
          backgroundColor: "#2196F3", // màu nền của Toast
          onPress: () => console.log("Toast pressed"), // hàm sẽ được gọi khi người dùng nhấn vào Toast
        });
      } else {
        favoritesObj[shopId] = productObj;
        console.log(`Added key: ${shopId}`);
        setFavorites(true);
        Toast.show({
          type: "info",
          text1: `${salonDetail?.description}`,
          text2: "Đã được thêm vào danh sách yêu thích",
          visibilityTime: 4000, // thời gian hiển thị Toast (tính bằng ms)
          autoHide: true, // tự động ẩn Toast sau thời gian visibilityTime
          topOffset: 30, // vị trí từ đỉnh màn hình (tính bằng px)
          bottomOffset: 40, // vị trí từ đáy màn hình (tính bằng px)
          textStyle: { fontSize: 20 }, // kiểu chữ cho text2
          text1Style: { fontSize: 14, fontWeight: "bold" }, // kiểu chữ cho text1
          backgroundColor: "#2196F3", // màu nền của Toast
          onPress: () => console.log("Toast pressed"), // hàm sẽ được gọi khi người dùng nhấn vào Toast
        });
      }

      await SecureStore.setItemAsync(favoritesId, JSON.stringify(favoritesObj));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Loader visible={loader} />
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
              {StoreDetail?.averageRating > 0
                ? (StoreDetail?.averageRating).toFixed(1) + "/5.0"
                : "No ratings"}
            </Text>
            <Text style={styles.averageRatingText}>
              {StoreDetail?.totalReviews
                ? StoreDetail?.totalReviews + " reviews"
                : "(0 review)"}
            </Text>
          </View>
        </View>
        <View style={styles.details}>
          {StoreDetail?.images?.length > 0 ? (
            // <Image source={{ uri: data.image[0] }} style={styles.image} />
            <View style={styles.carouselContainer}>
              <SliderBox
                images={StoreDetail?.images}
                dotColor={COLORS.primary}
                inactiveDotColor={COLORS.secondary}
                ImageComponentStyle={{
                  borderRadius: 15,
                  width: "93%",
                  marginTop: 15,
                }}
                autoplay
                circleLoop
              />
            </View>
          ) : (
            <Text>No image available</Text>
          )}
        </View>
        <View style={styles.descriptionWrapper}>
          <View>
            <Text style={styles.description}>{salonDetail?.description}</Text>
            <Text style={styles.descriptionText}>{salonDetail?.address}</Text>
            {StoreDetail?.saleUp && (
              <Text style={styles.sale} numberOfLines={1}>
                SALE
              </Text>
            )}
          </View>
          {idUser && (
            <TouchableOpacity onPress={addFavorites}>
              {favorites ? (
                <Ionicons name="heart" size={40} color="red" />
              ) : (
                <Ionicons name="heart-outline" size={40} color={COLORS.black} />
              )}
            </TouchableOpacity>
          )}
        </View>
        <TabViewComponent storeId={salonDetail?.id} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  webView: {
    height: "100%",
    width: "100%",
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    marginTop: SIZES.small,
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
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    width: SIZES.width - 44,
    top: SIZES.large,
    zIndex: 999,
  },
  details: {
    marginTop: -SIZES.large,
    backgroundColor: COLORS.lightWhite,
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
    position: "absolute",
    top: 0,
    right: 0,
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
});

export default Details;
