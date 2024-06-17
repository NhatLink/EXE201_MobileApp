import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";
import React, { useEffect, useState } from "react";
import ListSchedule from "../components/Schedule/ListSchedule";
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
import { useNavigation } from "@react-navigation/native";
import { Agenda } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import { GetAppointmentByAccountId } from "../store/appointment/action";
import Loader from "../components/auth/Loader";
import * as SecureStore from "expo-secure-store";
const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};
const Schedule = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { appointment, loading } = useSelector((state) => state.APPOINTMENT);
  console.log("appointment:", appointment);
  useEffect(() => {
    async function fetchData() {
      const accountId = await SecureStore.getItemAsync("accountId");
      if (accountId) {
        dispatch(
          GetAppointmentByAccountId(currentPage, itemsPerPage, accountId)
        );
      }
      console.log("accountId", accountId);
    }
    fetchData();
  }, []);

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
      dateSchedule: "2024-05-20",
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
      dateSchedule: "2024-05-29",
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
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const hasEvents = (date) => {
    return appointments.some(
      (appointment) => appointment.dateSchedule === date
    );
  };
  // const loadItems = (day) => {
  //   setTimeout(() => {
  //     const newItems = {};
  //     for (let i = -15; i < 85; i++) {
  //       const time = day.timestamp + i * 24 * 60 * 60 * 1000;
  //       const strTime = timeToString(time);

  //       if (!items[strTime]) {
  //         newItems[strTime] = [];
  //         if (hasEvents(strTime)) {
  //           const filteredAppointments = appointments.filter(
  //             (appointment) => appointment.dateSchedule === strTime
  //           );
  //           newItems[strTime] = filteredAppointments;
  //         } else {
  //           newItems[strTime].push({
  //             name: "Không có lịch hẹn nào vào ngày",
  //             height: 50,
  //             day: strTime,
  //           });
  //         }
  //       }
  //     }
  //     setItems((prevItems) => ({ ...prevItems, ...newItems }));
  //   }, 1000);
  // };
  useEffect(() => {
    const newItems = {};
    appointments.forEach((appointment) => {
      const { dateSchedule } = appointment;
      if (!newItems[dateSchedule]) {
        newItems[dateSchedule] = [];
      }
      newItems[dateSchedule].push(appointment);
    });
    setItems(newItems);
  }, []);

  const renderItem = (item) => {
    return <ListSchedule item={item} />;
  };
  const renderEmptyDate = () => {
    return (
      <View style={styles.Imgcontainer}>
        <Image
          source={require("../assets/images/error-in-calendar.png")}
          resizeMode="cover"
          style={styles.img}
        />
        <Text>Không có lịch hẹn nào vào ngày cả</Text>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        color: COLORS.lightWhite,
        marginBottom: 70,
        marginTop: 10,
      }}
    >
      <Loader visible={loading} />
      <Text style={styles.title}>Lịch hẹn của bạn</Text>
      {appointment.length === 0 ? (
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
        // <FlatList
        //   data={appointments}
        //   keyExtractor={(item) => item?.id}
        //   renderItem={({ item }) => <ListSchedule item={item} />}
        // />
        <Agenda
          items={items}
          renderItem={renderItem}
          renderEmptyData={renderEmptyDate}
          // loadItemsForMonth={loadItems}
          // renderEmptyDate={renderEmptyDate}
          // onDayPress={(day) => setSelectedDate(day)}
          theme={{
            agendaTodayColor: COLORS.red,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Schedule;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: SIZES.large,
    marginHorizontal: 20,
    paddingVertical: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.black,
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
  Imgcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 200,
    height: 200,
  },
});
