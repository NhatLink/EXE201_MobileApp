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
import { GestureHandlerRootView } from "react-native-gesture-handler";
const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};
const Schedule = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { appointment, loading } = useSelector((state) => state.APPOINTMENT);
  const { user, accessToken, refreshToken, isAuthenticated } = useSelector(
    (state) => state.USER
  );
  // console.log(appointment);
  // console.log(isAuthenticated);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const accountId = await SecureStore.getItemAsync("accountId");
    // console.log(accountId);
    if (accountId) {
      dispatch(GetAppointmentByAccountId(currentPage, itemsPerPage, accountId));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const [items, setItems] = useState({});
  // const [selectedDate, setSelectedDate] = useState(null);
  console.log("items", items);
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
    }
  }, [appointment]);

  const renderItem = (item) => {
    return <ListSchedule item={item} />;
  };
  // const renderItem = ({ item }) => <ListSchedule item={item} />;
  // const handleDayPress = (day) => {
  //   setSelectedDate(day.dateString);
  //   console.log('Selected date:', day.dateString);
  // };

  const renderEmptyDate = () => {
    return (
      <View style={styles.Imgcontainer}>
        <Image
          source={require("../assets/images/error-in-calendar.png")}
          resizeMode="cover"
          style={styles.img}
        />
        {!isAuthenticated && <Text>Không có lịch hẹn nào vào ngày này</Text>}
        {appointment && appointment?.length === 0 && (
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
        )}
      </View>
    );
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          <Agenda
            items={items}
            renderItem={renderItem}
            renderEmptyData={renderEmptyDate}
            // onRefresh={() => onRefresh}
            // refreshing={loading}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            // onDayPress={handleDayPress}

            theme={{
              agendaTodayColor: COLORS.red,
            }}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
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
