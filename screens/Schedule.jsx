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
import { fetchToken } from "../store/user/action";
const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};
const Schedule = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const { appointment, loading } = useSelector((state) => state.APPOINTMENT);
  const { user, accessToken, refreshToken, isAuthenticated } = useSelector(
    (state) => state.USER
  );
  // useEffect(() => {
  //   async function fetchDataTokenAndThenData() {
  //     const refreshToken = await SecureStore.getItemAsync("refreshToken");
  //     if (refreshToken) {
  //       await dispatch(
  //         fetchToken({
  //           refreshToken: refreshToken,
  //         })
  //       );
  //       fetchData();
  //     }
  //   }
  //   fetchDataTokenAndThenData();
  // }, [isAuthenticated]);
  const accountId = SecureStore.getItemAsync("accountId");
  useEffect(() => {
    async function fetchData() {
      const accountId = await SecureStore.getItemAsync("accountId");
      console.log(accountId);
      if (accountId) {
        dispatch(
          GetAppointmentByAccountId(currentPage, itemsPerPage, accountId)
        );
      }
    }
    fetchData();
  }, []);
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const newItems = {};
    appointment.forEach((appointment) => {
      const dateSchedule = appointment.startDate.split("T")[0];
      if (!newItems[dateSchedule]) {
        newItems[dateSchedule] = [];
      }
      newItems[dateSchedule].push(appointment);
    });
    setItems(newItems);
  }, [appointment]);

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
        <Text>Không có lịch hẹn nào vào ngày này</Text>
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
      {appointment && appointment?.length === 0 ? (
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
            {!isAuthenticated && (
              <>
                <Text style={styles.emptyText2}>
                  ---------------Đã sử dụng HairHub---------------
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Text style={styles.button}>Đăng Nhập</Text>
                </TouchableOpacity>
              </>
            )}
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
