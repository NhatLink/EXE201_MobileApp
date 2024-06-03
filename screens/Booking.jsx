import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { COLORS, SIZES, SHADOWS } from "../constants";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { useRoute } from "@react-navigation/native";
import { ListService, ListServiceModal } from "../components";
import {
  setStoreId,
  setDateBooking,
  setHourBooking,
  addService,
  updateService,
  removeService,
  resetBooking,
} from "../store/bookingStore/action";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/auth/Button";

const Booking = ({ navigation }) => {
  const barber = [
    {
      id: "1",
      image:
        "https://thegioitongdo.net/wp-content/uploads/2018/01/cat-toc-cho-be.jpg",
      company: "Jonh",
    },
    {
      id: "2",
      image:
        "https://tocnamdep.com/wp-content/uploads/2020/06/1557200230-1526030688-4-ti-m-c-t-toc-nam-p-qu-n-10-ang-m-t-l-n-n-va-tr-i-nghi-m.jpg",
      company: "Alex",
    },
    {
      id: "3",
      image:
        "https://hocvientoc.edu.vn/wp-content/uploads/2019/05/lich-cat-toc-nu-thang-5.jpg",
      company: "Mina",
    },
    {
      id: "4",
      image:
        "https://cdn.sanity.io/images/zqgvoczt/vietnam-migration/6d9d446d8510d7c052e77cbc731bf1759343ce7d-1200x800.jpg",
      company: "Hola",
    },
  ];

  const time = [
    { id: 1, time: "08:00 AM" },
    { id: 2, time: "08:30 AM" },
    { id: 3, time: "09:00 AM" },
    { id: 4, time: "09:30 AM" },
    { id: 5, time: "10:00 AM" },
    { id: 6, time: "10:30 AM" },
    { id: 7, time: "11:00 AM" },
    { id: 8, time: "11:30 AM" },
    { id: 13, time: "02:00 PM" },
    { id: 14, time: "02:30 PM" },
    { id: 15, time: "03:00 PM" },
    { id: 16, time: "03:30 PM" },
    { id: 17, time: "04:00 PM" },
    { id: 18, time: "04:30 PM" },
    { id: 19, time: "05:00 PM" },
  ];

  const dispatch = useDispatch();
  const { storeId, dateBooking, hourBooking, services, totalPrice, totalTime } =
    useSelector((state) => state.booking);
  // console.log("service: ", services);
  const handleGoBack = () => {
    dispatch(resetBooking());
    navigation.goBack();
  };

  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const [selected, setSelected] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    // console.log(today);
    dispatch(setDateBooking(today));
    dispatch(setHourBooking(time[0].time));
    setSelected(today);
  }, []);

  return (
    <>
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <View style={styles.upperRow}>
            <TouchableOpacity style={{ paddingLeft: 0 }} onPress={handleGoBack}>
              <Ionicons
                name="chevron-back-circle"
                size={30}
                color={COLORS.black}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Booking</Text>
          </View>

          {/* <ScrollView style={styles.content}> */}
          <Calendar
            onDayPress={(day) => {
              setSelected(day.dateString);
              dispatch(setDateBooking(day.dateString));
            }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: COLORS.secondary,
                selectedTextColor: COLORS.red,
              },
            }}
            theme={{
              backgroundColor: COLORS.gray,
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#00adf5",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e",
            }}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              borderTopWidth: 0.5,
              borderTopColor: COLORS.gray2,
              paddingVertical: 10,
              marginVertical: 15,
              borderBottomWidth: 0.5,
              borderBottomColor: COLORS.gray2,
            }}
          >
            {time.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.item,
                  item.time === hourBooking ? styles.selectedItem : null,
                ]}
                onPress={() => {
                  dispatch(setHourBooking(item.time));
                }}
              >
                <Text style={styles.text}>{item.time}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* <FlatList
          data={services}
          keyExtractor={(item) => item?.service_id.toString()}
          renderItem={({ item }) => <ListService item={item} />}
        /> */}
          <Text style={styles.addServiceText}>+ Thêm dịch vụ</Text>
          <ListService services={services} />
          <TouchableOpacity
            style={styles.addServiceContainer}
            onPress={() => openModal()}
          ></TouchableOpacity>
          {/* </ScrollView> */}

          <ListServiceModal isVisible={modalVisible} onClose={closeModal} />
        </SafeAreaView>
      </ScrollView>
      <View style={styles.bookContainer}>
        <View style={styles.bookPriceContainer}>
          <Text style={styles.priceText}>Total Price:</Text>
          <Text
            style={styles.priceText}
          >{`${totalPrice.toLocaleString()} VND`}</Text>
        </View>
        <Button title="Đặt Lịch" />
      </View>
    </>
  );
};

export default Booking;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  upperRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SIZES.width - 50,
    marginBottom: SIZES.xSmall,
  },
  content: {},
  title: {
    fontSize: SIZES.xLarge,
    fontWeight: "bold",
    // letterSpacing: 2,
  },
  item: {
    alignItems: "center",
    marginRight: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.gray2,
  },
  selectedItem: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.black,
  },
  image: {
    width: 50, // Đặt kích thước cho hình ảnh
    height: 50, // Đặt kích thước cho hình ảnh
    borderRadius: 40, // Làm tròn hình ảnh
    overflow: "hidden", // Ẩn các phần bị cắt của hình ảnh
  },
  text: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addServiceContainer: {
    color: COLORS.green,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  addServiceText: {
    fontSize: SIZES.medium,
    textAlign: "left",
    fontWeight: "bold",
  },
  bookContainer: {
    padding: 5,
    backgroundColor: COLORS.banner,
  },
  bookPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 5,
  },
  priceText: {
    fontSize: SIZES.medium,
    fontWeight: "bold",
  },
});
