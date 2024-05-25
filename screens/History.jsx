import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";
import React, { useState } from "react";
import { ListHistory } from "../components";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Animated,
} from "react-native";
import axios from "axios";
import { baseUrl } from "../utils/IP";
import SearchTile from "../components/product/SearchTile";
import SearchWhereModal from "../components/Search/SearchWhereModal";
import SearchStoreModal from "../components/Search/SearchStoreModal";
import SearchSeviceModal from "../components/Search/SearchSeviceModal";
import { useNavigation } from "@react-navigation/native";
const History = () => {
  const navigation = useNavigation();
  const appointments = [
    {
      id: 1,
      dateSchedule: "2024-05-20",
      timeSchedule: "10:00 AM",
      store: {
        id: 101,
        image:
          "https://www.gento.vn/wp-content/uploads/2024/04/barber-la-gi-8.jpg",
        name: "Beauty Salon A",
        address: "123 Main St, Cityville",
      },
      services: [
        {
          id: 201,
          serviceName: "Basic Haircut",
          price: 150000,
          discountPrice: 120000,
          time: "30 minutes",
        },
        {
          id: 202,
          serviceName: "Shaving",
          price: 100000,
          time: "15 minutes",
        },
      ],
      totalPrice: 220000, // Assuming discount was applied to the first service only
      totalTime: "45 minutes",
    },
    {
      id: 2,
      dateSchedule: "2024-05-21",
      timeSchedule: "01:00 PM",
      store: {
        id: 102,
        image:
          "https://www.gento.vn/wp-content/uploads/2024/04/barber-la-gi-8.jpg",
        name: "Hair Studio B",
        address: "456 Oak St, Townsville",
      },
      services: [
        {
          id: 203,
          serviceName: "Hair Coloring",
          price: 500000,
          discountPrice: 450000,
          time: "90 minutes",
        },
      ],
      totalPrice: 450000,
      totalTime: "90 minutes",
    },
    {
      id: 3,
      dateSchedule: "2024-05-22",
      timeSchedule: "03:30 PM",
      store: {
        id: 103,
        image:
          "https://www.gento.vn/wp-content/uploads/2024/04/barber-la-gi-8.jpg",
        name: "Salon C",
        address: "789 Pine St, Villagetown",
      },
      services: [
        {
          id: 204,
          serviceName: "Hair Care",
          price: 200000,
          time: "45 minutes",
        },
        {
          id: 205,
          serviceName: "Basic Haircut",
          price: 150000,
          time: "30 minutes",
        },
      ],
      totalPrice: 350000,
      totalTime: "75 minutes",
    },
    {
      id: 4,
      dateSchedule: "2024-05-23",
      timeSchedule: "11:00 AM",
      store: {
        id: 104,
        image:
          "https://www.gento.vn/wp-content/uploads/2024/04/barber-la-gi-8.jpg",
        name: "Luxury Hair D",
        address: "321 Elm St, Metropolis",
      },
      services: [
        {
          id: 206,
          serviceName: "Hair Coloring",
          price: 500000,
          time: "90 minutes",
        },
        {
          id: 207,
          serviceName: "Shaving",
          price: 100000,
          time: "15 minutes",
        },
      ],
      totalPrice: 600000,
      totalTime: "105 minutes",
    },
    {
      id: 5,
      dateSchedule: "2024-05-24",
      timeSchedule: "09:00 AM",
      store: {
        id: 105,
        image:
          "https://www.gento.vn/wp-content/uploads/2024/04/barber-la-gi-8.jpg",
        name: "Exclusive Salon E",
        address: "654 Willow St, Capital City",
      },
      services: [
        {
          id: 208,
          serviceName: "Basic Haircut",
          price: 150000,
          time: "30 minutes",
        },
        {
          id: 209,
          serviceName: "Hair Care",
          price: 200000,
          time: "45 minutes",
        },
      ],
      totalPrice: 350000,
      totalTime: "75 minutes",
    },
  ];
  // console.log("appoint", appointments);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        color: COLORS.lightWhite,
        marginTop: 10,
      }}
    >
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}> Lịch sử </Text>
      </View>

      {appointments.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Image
              source={require("../assets/images/error-in-calendar.png")}
              style={styles.searchImage}
            />
            <Text style={styles.emptyText}>
              Không có lịch hẹn nào được tìm thấy
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Text style={styles.button}>Tìm kiếm dịch vụ</Text>
            </TouchableOpacity>
            <Text style={styles.emptyText2}>
              ---------------Đã sử dụng HairHub---------------
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Text style={styles.button}>Đăng Nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => <ListHistory item={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: SIZES.large,
    textAlign: "center",
  },
  upperRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SIZES.width - 50,
    marginBottom: SIZES.xSmall,
    marginHorizontal: 20,
  },
  searchImage: {
    resizeMode: "cover",
    width: 300,
    height: 300,
    opacity: 0.9,
  },
  emptyText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: SIZES.medium,
  },
  emptyText2: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginVertical: 10,
  },
  button: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    width: SIZES.width - 20,
    fontWeight: "bold",
  },
});
