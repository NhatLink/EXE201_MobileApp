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
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../../utils/helper";
import OrderTile from "../../components/orders/OrderTile";
import MapView, { Marker } from "react-native-maps";

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
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Giới thiệu</Text>
        <View style={styles.AboutUsContanner}>
          <Text style={styles.serviceDescription} numberOfLines={3}>
            Tóc của bạn đang bị chẻ ngọn và khô xơ? Hãy đến với chúng tôi để tóc
            bạn được chăm sóc và tái tạo sức sống như mới.
          </Text>
          <Text style={styles.serviceDescription} numberOfLines={3}>
            Cảm thấy nhàm chán với kiểu tóc hiện tại? Hãy để chúng tôi giúp bạn
            tạo nên một phong cách tóc mới, thật cá tính và độc đáo.
          </Text>
        </View>
      </View>
      <View>
        <Text style={styles.title}>Map</Text>
        <View style={styles.AboutUsContanner}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              // provider={MapView.PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 10.875123789279687,
                longitude: 106.79814847509016,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: 10.875123789279687,
                  longitude: 106.79814847509016,
                }}
                title={"Nhà Văn hóa Sinh viên TP.HCM"}
                description={"A nice place in Ho Chi Minh City"}
              />
            </MapView>
          </View>
        </View>
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
              012345678
            </Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
            <Text style={styles.button}>Call</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactContanner}>
          <View style={styles.contactInfo}>
            <Ionicons name="logo-facebook" size={20} color={COLORS.primary} />
            <Text style={styles.conntactItem} numberOfLines={1}>
              Baber's Haven
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
              Baber's Haven
            </Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
            <Text style={styles.button}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={styles.title}>Giờ Làm Việc</Text>
        {workingDays.map((item) => (
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
              {item?.status === "Open" ? (
                <>
                  <Text style={styles.servicePrice} numberOfLines={1}>
                    {item.openTime} - {item.closeTime}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.servicePrice} numberOfLines={1}>
                    {item.status}
                  </Text>
                </>
              )}

              {/* <Text
                style={styles.serviceDescription}
                numberOfLines={1}
              >{`${item.serviceTime}`}</Text> */}
            </View>
            {/* <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
                <Text style={styles.button}>Book</Text>
              </TouchableOpacity> */}
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
    flex: 2, // 2 parts
    flexDirection: "column",
    alignItems: "flex-end", // Align text to right if needed
  },
  bookButton: {
    flex: 2, // 1 part
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
  map: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
});
