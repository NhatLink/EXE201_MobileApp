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
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../../utils/helper";
import OrderTile from "../../components/orders/OrderTile";
import MapView, { Polyline, Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import axios from "axios";
const GOOGLE_API_KEY = "AIzaSyCmAt2KHp7yJVDWMWlrd_uUMtvzhSExNaQ";
const About = (storeId) => {
  const navigation = useNavigation();
  const workingDays = [
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
  ];
  const { salonService, salonDetail, salonEmployee } = useSelector(
    (state) => state.SALON
  );

  // const [destination, setDestination] = useState({
  //   latitude: 10.875123789279687,
  //   longitude: 106.79814847509016,
  // });
  // const [origin, setOrigin] = useState({
  //   latitude: 10.762622, // Vị trí mặc định tại TP Hồ Chí Minh
  //   longitude: 106.660172,
  // });
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert("Permission to access location was denied");
  //       return;
  //     }

  //     let { coords } = await Location.getCurrentPositionAsync({});
  //     setOrigin({
  //       latitude: coords.latitude,
  //       longitude: coords.longitude,
  //     });
  //   })();
  // }, []);
  // useEffect(() => {
  //   if (salonDetail) {
  //     setDestination({
  //       latitude: parseFloat(salonDetail?.latitude),
  //       longitude: parseFloat(salonDetail?.longitude),
  //     });
  //   }
  // }, [salonDetail]);

  // const getDirections = async () => {
  //   if (!origin) return;

  //   const originString = `${origin.latitude},${origin.longitude}`;
  //   const destinationString = `${destination.latitude},${destination.longitude}`;

  //   try {
  //     const response = await axios.get(
  //       `https://maps.googleapis.com/maps/api/directions/json?origin=${originString}&destination=${destinationString}&key=${GOOGLE_API_KEY}`
  //     );

  //     const route = response.data.routes[0];
  //     const leg = route.legs[0];

  //     setDistance(leg.distance.text);
  //     setDuration(leg.duration.text);
  //     setStartAddress(leg.start_address);
  //     setEndAddress(leg.end_address);

  //     const points = decode(route.overview_polyline.points);
  //     console.log("points", points);
  //     const validPoints = points.filter(
  //       (point) => !isNaN(point.latitude) && !isNaN(point.longitude)
  //     );
  //     setRoute(validPoints);
  //   } catch (error) {
  //     console.error("Error getting directions:", error);
  //     Alert.alert("Error", "Unable to retrieve directions. Please try again.");
  //   }
  // };

  // const decode = (t, e) => {
  //   let d = [];
  //   let index = 0,
  //     len = t.length;
  //   let lat = 0,
  //     lng = 0;

  //   while (index < len) {
  //     let b,
  //       shift = 0,
  //       result = 0;
  //     do {
  //       b = t.charCodeAt(index++) - 63;
  //       result |= (b & 0x1f) << shift;
  //       shift += 5;
  //     } while (b >= 0x20);
  //     let dlat = result & 1 ? ~(result >> 1) : result >> 1;
  //     lat += dlat;

  //     shift = 0;
  //     result = 0;
  //     do {
  //       b = t.charCodeAt(index++) - 63;
  //       result |= (b & 0x1f) << shift;
  //       shift += 5;
  //     } while (b >= 0x20);
  //     let dlng = result & 1 ? ~(result >> 1) : result >> 1;
  //     lng += dlng;

  //     d.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  //   }
  //   return d;
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Giới thiệu</Text>
        <View style={styles.AboutUsContanner}>
          <Text style={styles.serviceDescription} numberOfLines={3}>
            {salonDetail?.description}
          </Text>
        </View>
      </View>
      <View>
        <Text style={styles.title}>Map</Text>
        <View style={styles.AboutUsContanner}>
          <View style={styles.mapContainer}>
            {salonDetail && salonDetail?.latitude && salonDetail?.longitude && (
              <MapView
                style={styles.map}
                provider={MapView.PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: parseFloat(salonDetail?.latitude),
                  longitude: parseFloat(salonDetail?.longitude),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {/* {route.length > 0 && origin && (
                  <Marker coordinate={origin} title="Your Location" />
                )} */}
                <Marker
                  coordinate={{
                    latitude: parseFloat(salonDetail?.latitude),
                    longitude: parseFloat(salonDetail?.longitude),
                  }}
                  title={salonDetail?.name}
                  description={salonDetail?.address}
                />
                {/* {route.length > 0 && (
                  <Polyline
                    coordinates={route}
                    strokeWidth={5}
                    strokeColor="blue"
                  />
                )} */}
              </MapView>
            )}
          </View>
          {/* {route.length > 0 && (
            <View style={styles.distance}>
              <Text style={styles.textDistance}>Bắt đầu: {startAddress}</Text>
              <Text style={styles.textDistance}>Kết thúc: {endAddress}</Text>
              <Text style={styles.textDistance}>Khoảng cách: {distance}</Text>
              <Text style={styles.textDistance}>Thời gian: {duration}</Text>
            </View>
          )} */}
        </View>

        {/* <Button title="Get Directions" onPress={getDirections} /> */}

        {/* {route.length === 0 && (
          <TouchableOpacity style={styles.bookButton2} onPress={getDirections}>
            <Text style={styles.button}>Chỉ vị trí</Text>
          </TouchableOpacity>
        )} */}
      </View>
      <View>
        <Text style={styles.title}>Số Liên Hệ</Text>
        <View style={styles.contactContanner}>
          <View style={styles.contactInfo}>
            <Ionicons
              name="phone-portrait-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.conntactItem} numberOfLines={1}>
              {salonDetail?.salonOwner?.phone}
            </Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
            <Text style={styles.button}>Call</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.contactContanner}>
          <View style={styles.contactInfo}>
            <Ionicons name="logo-facebook" size={20} color={COLORS.primary} />
            <Text style={styles.conntactItem} numberOfLines={1}>
              {salonDetail?.name}
            </Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
            <Text style={styles.button}>View</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactContanner}>
          <View style={styles.contactInfo}>
            <Ionicons name="logo-instagram" size={20} color={COLORS.primary} />
            <Text style={styles.conntactItem} numberOfLines={1}>
              {salonDetail?.name}
            </Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
            <Text style={styles.button}>View</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View>
        <Text style={styles.title}>Giờ Làm Việc</Text>
        {salonDetail &&
          salonDetail?.schedules &&
          salonDetail?.schedules?.map((item) => (
            <View
              key={item.dayOfWeek}
              style={styles.serviceItem}
              onPress={() => {
                // Handle navigation or other actions
              }}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName} numberOfLines={1}>
                  {item.dayOfWeek}
                </Text>
              </View>
              <View style={styles.pricingInfo}>
                {item?.isActive ? (
                  <Text style={styles.servicePrice} numberOfLines={2}>
                    {item.startTime} - {item.endTime}
                  </Text>
                ) : (
                  <Text style={styles.servicePrice} numberOfLines={1}>
                    Close
                  </Text>
                )}
              </View>
            </View>
          ))}
      </View>
    </SafeAreaView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.lightWhite,
    position: "relative",
  },
  upperRow: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SIZES.width - 50,
  },
  title: {
    fontSize: SIZES.small,
    fontWeight: "bold",
    paddingTop: SIZES.small,
    marginHorizontal: SIZES.medium,
    marginBottom: SIZES.xSmall,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    marginVertical: 5,
    marginHorizontal: SIZES.medium,
  },
  serviceInfo: {
    flex: 6, // 7 parts
    flexDirection: "column",
  },
  pricingInfo: {
    flex: 4, // 2 parts
    flexDirection: "column",
    alignItems: "flex-end", // Align text to right if needed
  },
  bookButton: {
    flex: 2, // 1 part
  },
  bookButton2: {
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginLeft: 5,
    fontWeight: "bold",
  },
  serviceName: {
    fontSize: SIZES.small,
    fontWeight: "bold",
  },
  serviceDescription: {
    fontSize: SIZES.small,
  },
  servicePrice: {
    fontSize: SIZES.small,
    fontWeight: "bold",
  },
  contactContanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 5,
    marginHorizontal: SIZES.medium,
  },
  conntactItem: {
    fontSize: SIZES.small,
    fontWeight: "bold",
    marginHorizontal: SIZES.xSmall,
  },
  contactInfo: {
    flex: 8, // 7 parts
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  AboutUsContanner: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 5,
    marginHorizontal: SIZES.medium,
  },
  mapContainer: {
    borderRadius: 10,
    borderColor: COLORS.primary,
    borderWidth: 2,
    width: "100%",
  },
  distance: {},
  textDistance: {
    fontSize: SIZES.small,
    fontWeight: "bold",
    marginHorizontal: SIZES.xSmall,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
});
