import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  AppState,
  Image,
} from "react-native";
import { COLORS, SIZES } from "../constants";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Carousel, Headings, Welcome } from "../components";
import ProductsRow from "../components/product/ProductsRow";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchUser2 } from "../store/user/action";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { fetchSalonInformation } from "../store/salon/action";

const Home = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState("0");
  const [location, setLocation] = useState("Ho Chi Minh, Vietnam");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  useEffect(() => {
    // checkUserExistence();
    getLocation();
  }, []);

  const dispatch = useDispatch();
  // useEffect(() => {
  //   const handleUserFetch = async () => {
  //     try {
  //       console.log("fetchUser2");
  //       const accessToken = await SecureStore.getItemAsync("accessToken");
  //       if (accessToken) {
  //         await dispatch(fetchUser2(accessToken));
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy accessToken", error);
  //     }
  //   };

  //   handleUserFetch();
  // }, []);

  const handlePress = () => {
    if (userLoggedIn) {
      navigation.navigate("Cart");
    } else {
      navigation.navigate("Login");
    }
  };

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Yêu cầu vị trí bị từ chối !");
      return false;
    }
    return true;
  };

  const getLocation = async () => {
    if (await requestLocationPermission()) {
      try {
        let { coords } = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        // console.log(address);
        if (address.length > 0) {
          setLocation(address[0].subregion + ", " + address[0].region);
        }
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert(
          "Lỗi",
          "Chưa thể lấy được vị trí của người dùng, vui lòng thử lại sau!"
        );
      }
    }
  };

  useEffect(() => {
    dispatch(fetchSalonInformation());
  }, [dispatch]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarWrapper}>
        <View style={styles.appBar}>
          <Ionicons name="location-outline" size={28} color="black" />
          <Text style={styles.location}>{location}</Text>

          {/* <View style={{ alignItems: "flex-end" }}>
            <View style={styles.cartCounter}>
              <Text style={styles.cartNumber}>{cartCount ? cartCount : 0}</Text>
            </View>
            <TouchableOpacity onPress={() => handlePress()}>
              <Fontisto name="shopping-bag" size={24} color="black" />
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
      <ScrollView>
        <View style={{ marginHorizontal: 10 }}>
          <Welcome />
          <Carousel />
          <Headings />
          {/* <ProductsRow /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  appBarWrapper: {
    paddingHorizontal: 22,
    marginTop: 12,
    // backgroundColor: COLORS.secondary,
  },
  location: {
    color: COLORS.gray,
    fontFamily: "semibold",
    fontSize: SIZES.medium,
  },
  cartCounter: {
    position: "absolute",
    bottom: 16,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  cartNumber: {
    fontWeight: "600",
    fontSize: 10,
    color: COLORS.white,
  },
});
