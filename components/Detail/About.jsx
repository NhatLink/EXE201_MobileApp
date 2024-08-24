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
  ToastAndroid,
  Linking,
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
import CustomMarker from "../CustomMarker";
const GOOGLE_API_KEY = "AIzaSyAs7hqe3ZUJTjrM7KbdVqkdxB__0eCcKgE";
const About = (storeId) => {
  const navigation = useNavigation();
  const mapRef = React.useRef(null);
  const { salonService, salonDetail, salonEmployee } = useSelector(
    (state) => state.SALON
  );

  const handleCallPress = (phoneNumber) => {
    if (phoneNumber && phoneNumber.match(/^[0-9]{10}$/)) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      ToastAndroid.show(
        "Có vẻ số điện thoại của salon / barber không đúng, vui lòng thử lại sau",
        ToastAndroid.SHORT
      );
    }
  };

  const handlePress = () => {
    const email = salonDetail?.salonOwner?.email;
    if (email) {
      const url = `mailto:${email}`;
      Linking.openURL(url).catch((err) => console.error("Error:", err));
    }
  };

  const handleReturnToMarker = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: parseFloat(salonDetail?.latitude),
          longitude: parseFloat(salonDetail?.longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      ); // 1000 milliseconds to animate
    }
  };

  const daysOfWeekMap = {
    Monday: "Thứ Hai",
    Tuesday: "Thứ Ba",
    Wednesday: "Thứ Tư",
    Thursday: "Thứ Năm",
    Friday: "Thứ Sáu",
    Saturday: "Thứ Bảy",
    Sunday: "Chủ Nhật",
  };

  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const sortedSchedules = salonDetail?.schedules?.sort(
    (a, b) => daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek)
  );

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
        <Text style={styles.title}>Bản đồ</Text>
        <View style={styles.AboutUsContanner}>
          <View style={styles.mapContainer}>
            {salonDetail && salonDetail?.latitude && salonDetail?.longitude ? (
              <MapView
                ref={mapRef}
                style={styles.map}
                provider={MapView.PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: parseFloat(salonDetail?.latitude),
                  longitude: parseFloat(salonDetail?.longitude),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <CustomMarker
                  coordinate={{
                    latitude: parseFloat(salonDetail?.latitude),
                    longitude: parseFloat(salonDetail?.longitude),
                  }}
                  image={salonDetail?.img}
                  title={salonDetail?.name}
                  description={salonDetail?.description}
                />
              </MapView>
            ) : (
              <Text style={styles.serviceDescription} numberOfLines={3}>
                Bản đồ hiện không khả dụng
              </Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonMap}
              onPress={handleReturnToMarker}
            >
              <Text style={styles.buttonTextMap}>
                Quay lại vị trí salon/barber
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.title}>Liên Hệ</Text>
        <View style={styles.contactContanner}>
          <View style={styles.contactInfo}>
            <Ionicons name="people" size={20} color={COLORS.primary} />
            <Text style={styles.conntactItem} numberOfLines={1}>
              Chủ salon: {salonDetail?.salonOwner?.fullName}
            </Text>
          </View>
        </View>
        <View style={styles.contactContanner}>
          <View style={styles.contactInfo}>
            <Ionicons name="mail" size={20} color={COLORS.primary} />
            <Text style={styles.conntactItem} numberOfLines={1}>
              {salonDetail?.salonOwner?.email}
            </Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={handlePress}>
            <Text style={styles.button}>Gửi email</Text>
          </TouchableOpacity>
        </View>
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
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              handleCallPress(salonDetail?.salonOwner?.phone);
            }}
          >
            <Text style={styles.button}>Gọi điện</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={styles.title}>Giờ Làm Việc</Text>
        {sortedSchedules?.map((item) => (
          <View
            key={item.id} // Sử dụng id thay vì dayOfWeek để đảm bảo key là duy nhất
            style={styles.serviceItem}
          >
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName} numberOfLines={1}>
                {daysOfWeekMap[item.dayOfWeek]}{" "}
                {/* Chuyển đổi ngày từ tiếng Anh sang tiếng Việt */}
              </Text>
            </View>
            <View style={styles.pricingInfo}>
              {item.isActive ? (
                <Text style={styles.servicePrice} numberOfLines={2}>
                  {item.startTime} - {item.endTime}
                </Text>
              ) : (
                <Text style={styles.servicePrice} numberOfLines={1}>
                  Đóng cửa
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
    backgroundColor: COLORS.background,
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
    flex: 3, // 1 part
  },
  bookButton2: {
    marginHorizontal: 20,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    // marginLeft: 5,
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
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonMap: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  buttonTextMap: {
    color: COLORS.black,
    textAlign: "center",
  },
});
