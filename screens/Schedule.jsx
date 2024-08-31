import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";
import React, { useCallback, useEffect, useState } from "react";
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
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { baseUrl } from "../utils/IP";
import { useNavigation } from "@react-navigation/native";
import { Agenda, LocaleConfig } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import { GetAppointmentByAccountId } from "../store/appointment/action";
import Loader from "../components/auth/Loader";
import * as SecureStore from "expo-secure-store";
import { fetchToken } from "../store/user/action";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

LocaleConfig.locales["vi"] = {
  monthNames: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthNamesShort: [
    "Th.1",
    "Th.2",
    "Th.3",
    "Th.4",
    "Th.5",
    "Th.6",
    "Th.7",
    "Th.8",
    "Th.9",
    "Th.10",
    "Th.11",
    "Th.12",
  ],
  dayNames: [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Hôm nay",
};
LocaleConfig.defaultLocale = "vi";

const Schedule = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [items, setItems] = useState({});
  // const todayDate = new Date().toISOString().split("T")[0];
  // const [selectedDate, setSelectedDate] = useState(todayDate);
  const { appointment, loading } = useSelector((state) => state.APPOINTMENT);
  const { user, accessToken, refreshToken, isAuthenticated, accountId } =
    useSelector((state) => state.USER);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (accountId) {
      dispatch(GetAppointmentByAccountId(currentPage, itemsPerPage, accountId));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    const newItems = {};
    if (appointment && appointment.length > 0) {
      appointment?.forEach((appointment) => {
        const dateSchedule = appointment.startDate.split("T")[0];
        if (!newItems[dateSchedule]) {
          newItems[dateSchedule] = [];
        }
        newItems[dateSchedule].push(appointment);
      });
      setItems(newItems);
    } else {
      setItems({});
    }
  }, [appointment]);

  const renderItem = (item) => {
    return <ListSchedule item={item} />;
  };
  // console.log("1", appointment);
  // console.log("2", items);
  const renderEmptyDate = () => {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.background }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.Imgcontainer}>
          <Image
            source={require("../assets/images/error-in-calendar.png")}
            resizeMode="cover"
            style={styles.img}
          />
          {isAuthenticated && <Text>Không có lịch hẹn nào vào ngày này</Text>}
          {appointment && appointment?.length === 0 && (
            <View style={{ marginTop: 10 }}>
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
          )}
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Lịch hẹn của bạn</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <Text style={styles.title}>Lịch hẹn của bạn</Text>
      {/* <TouchableOpacity
        onPress={() => setSelectedDate(todayDate)}
        style={styles.todayButton}
      >
        <Text style={styles.todayButtonText}>Hôm nay</Text>
      </TouchableOpacity> */}
      {!isAuthenticated ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
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
          <View style={{ marginTop: 10 }}>
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
        <Agenda
          items={items}
          // selected={selectedDate}
          // hideKnob={true}
          renderItem={renderItem}
          renderEmptyData={renderEmptyDate}
          pastScrollRange={2}
          futureScrollRange={2}
          // onDayPress={(day) => setSelectedDate(day.dateString)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          theme={{
            agendaTodayColor: COLORS.red,
            todayTextColor: COLORS.red,
            agendaKnobColor: COLORS.secondary,
            backgroundColor: COLORS.background,
            agendaBackgroundColor: COLORS.background,
            agendaEventBackgroundColor: COLORS.background,
            calendarBackground: COLORS.background,
            selectedDayBackgroundColor: "#bf9456",
            // dayTextColor: COLORS.secondary,
            textSectionTitleColor: COLORS.secondary,
            // monthTextColor: COLORS.secondary,
          }}
          // rowHasChanged={(r1, r2) => r1.name !== r2.name}
        />
      )}
    </SafeAreaView>
  );
};

export default Schedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontWeight: "bold",
    fontSize: SIZES.large,
    marginHorizontal: 20,
    paddingVertical: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.black,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: COLORS.background,
  },
  searchImage: {
    resizeMode: "cover",
    width: SIZES.width - 500,
    height: SIZES.height - 500,
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
    backgroundColor: COLORS.background,
  },
  img: {
    width: 200,
    height: 200,
  },
  todayButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginVertical: 10,
    position: "absolute",
    bottom: 10,
    left: 10,
    zIndex: 1,
  },
  todayButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
