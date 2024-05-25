import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { COLORS, SIZES } from "../constants";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Carousel, Headings, Welcome } from "../components";
import ProductsRow from "../components/product/ProductsRow";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState("0");
  const [location, setLocation] = useState("Ho Chi Minh, Vietnam");

  useEffect(() => {
    checkUserExistence();
    getLocation();
  }, []);

  const checkUserExistence = async () => {
    const id = await AsyncStorage.getItem("id");
    const userID = `user${JSON.parse(id)}`;
    try {
      const userData = await AsyncStorage.getItem(userID);
      if (userData !== null) {
        const parsedData = JSON.parse(userData);
        setUserLoggedIn(true);
        setUserData(parsedData);

        const count = await AsyncStorage.getItem("cartCount");
        if (count !== null) {
          const parsedCart = JSON.parse(count);
          setCartCount(parsedCart);
          console.log("cart count:", parsedCart);
        } else {
          return;
        }
      } else {
        return;
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

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
      alert("Permission to access location was denied");
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
        console.log(address);
        if (address.length > 0) {
          setLocation(address[0].subregion + ", " + address[0].region);
        }
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Unable to retrieve location. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.appBarWrapper}>
        <View style={styles.appBar}>
          <Ionicons name="location-outline" size={28} color="black" />
          <Text style={styles.location}>{location}</Text>

          <View style={{ alignItems: "flex-end" }}>
            <View style={styles.cartCounter}>
              <Text style={styles.cartNumber}>{cartCount ? cartCount : 0}</Text>
            </View>
            <TouchableOpacity onPress={() => handlePress()}>
              <Fontisto name="shopping-bag" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={{ marginHorizontal: 10 }}>
          <Welcome />
          <Carousel />
          <Headings />
          <ProductsRow />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appBarWrapper: {
    marginHorizontal: 22,
    marginTop: 12,
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
