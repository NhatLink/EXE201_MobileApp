import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
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
  setServiceStaff,
  setService,
} from "../store/bookingStore/action";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/auth/Button";
import {
  GetAvailableTime,
  BookAppointment,
  resetAvailable,
} from "../store/booking/action";
import Loader from "../components/auth/Loader";
import { GetVoucherBySalonId } from "../store/voucher/action";
import VoucherModal from "../components/booking/VoucherModal";

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
  const {
    storeId,
    dateBooking,
    hourBooking,
    services,
    totalPrice,
    totalTime,
    voucher,
  } = useSelector((state) => state.booking);
  const { loading, availableTime, bookAppoinment, error } = useSelector(
    (state) => state.BOOKING
  );
  // console.log("availableTime", availableTime);
  console.log("bookAppoinment", bookAppoinment?.bookingDetailResponses);
  // console.log("voucher:", voucher);
  const canPressButton = availableTime && availableTime.length > 0;
  const confirmBooking = () => {
    console.log("initialState: ", {
      // storeId,
      // dateBooking,
      // hourBooking,
      services,
      // totalPrice,
      // totalTime,
      // voucher,
    });
  };

  const handleGoBack = () => {
    dispatch(resetBooking());
    dispatch(resetAvailable());
    navigation.goBack();
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVoucherVisible, setModalVoucherVisible] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
  };
  const openModal = () => {
    setModalVisible(true);
  };
  const openVoucherModal = () => {
    setModalVoucherVisible(true);
  };
  const closeVoucherModal = () => {
    setModalVoucherVisible(false);
  };

  const formatDate = (date) => {
    return date
      .toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .reverse()
      .join("-");
  };
  const [selected, setSelected] = useState(formatDate(new Date()));
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [loadingTime, setSelectedDateTime] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  });

  // useEffect(() => {
  //   dispatch(GetVoucherBySalonId(storeId, currentPage, itemsPerPage));
  // }, []);

  useEffect(() => {
    dispatch(setDateBooking(selectedDate));
    if (availableTime.length > 0 && !hourBooking) {
      const firstTimeSlot = availableTime[0].timeSlot;
      dispatch(setHourBooking(firstTimeSlot));
    }
    dispatch(GetVoucherBySalonId(storeId, currentPage, itemsPerPage));
  }, [selectedDate, availableTime]);

  // useEffect(() => {
  //   if (availableTime.length > 0) {
  //     const selectedTime = availableTime.find(
  //       (time) => time.timeSlot === hourBooking
  //     );
  //     console.log(
  //       "employeeAvailables: ",
  //       selectedTime ? selectedTime.employeeAvailables : []
  //     );
  //     if (selectedTime && selectedTime.employeeAvailables) {
  //       dispatch(setServiceStaff(selectedTime.employeeAvailables));
  //     }
  //   }
  // }, [hourBooking, availableTime]);

  // useEffect(() => {
  //   if (services.length > 0) {
  //     let data = {
  //       day: new Date(dateBooking).toISOString(),
  //       salonId: storeId,
  //       serviceHairId: services[0]?.id,
  //       salonEmployeeId:
  //         services[0]?.staff?.id !== "0" ? services[0]?.staff?.id : null,
  //       isAnyOne: services[0]?.staff?.id === "0",
  //     };
  //     dispatch(GetAvailableTime(data));
  //   } else if (services.length > 1 && hourBooking) {
  //     let bookingDetails = services.map((service) => {
  //       return {
  //         serviceHairId: service.id,
  //         salonEmployeeId: service.staff?.id !== "0" ? service.staff?.id : null,
  //         isAnyOne: service.staff?.id === "0",
  //       };
  //     });

  //     let data = {
  //       day: new Date(dateBooking).toISOString(),
  //       availableSlot: hourBooking,
  //       salonId: storeId,
  //       bookingDetail: bookingDetails,
  //     };
  //     dispatch(BookAppointment(data));
  //   }
  // }, [dateBooking, storeId, services, hourBooking]);

  // useEffect(() => {
  //   // Kiểm tra điều kiện khi dateBooking và services thay đổi
  //   if (dateBooking && services.length > 0 && services.length <= 1) {
  //     let data = {
  //       day: new Date(dateBooking).toISOString(),
  //       salonId: storeId,
  //       serviceHairId: services[0]?.id,
  //       salonEmployeeId:
  //         services[0]?.staff?.id !== "0" ? services[0]?.staff?.id : null,
  //       isAnyOne: services[0]?.staff?.id === "0",
  //     };
  //     dispatch(GetAvailableTime(data));
  //   }

  //   // Kiểm tra điều kiện khi hourBooking, services và services.length > 1 thay đổi
  //   if (hourBooking && services.length > 0) {
  //     let bookingDetails = services.map((service) => ({
  //       serviceHairId: service.id,
  //       salonEmployeeId: service.staff?.id !== "0" ? service.staff?.id : null,
  //       isAnyOne: service.staff?.id === "0",
  //     }));

  //     let data = {
  //       day: new Date(dateBooking).toISOString(),
  //       availableSlot: hourBooking,
  //       salonId: storeId,
  //       bookingDetail: bookingDetails,
  //     };
  //     dispatch(BookAppointment(data));
  //   }
  // }, [dateBooking, storeId, services, hourBooking]);
  useEffect(() => {
    if (dateBooking && services.length > 0) {
      let data = {
        day: new Date(dateBooking).toISOString(),
        salonId: storeId,
        serviceHairId: services[0]?.id,
        salonEmployeeId:
          services[0]?.staff?.id !== "0" ? services[0]?.staff?.id : null,
        isAnyOne: services[0]?.staff?.id === "0",
      };
      // dispatch(setHourBooking(null));
      dispatch(GetAvailableTime(data));
    }
  }, [dateBooking, storeId, services]);

  useEffect(() => {
    if (hourBooking && services.length > 0) {
      let bookingDetails = services.map((service) => ({
        serviceHairId: service.id,
        salonEmployeeId: service.staff?.id !== "0" ? service.staff?.id : null,
        isAnyOne: service.staff?.id === "0",
      }));

      let data = {
        day: new Date(dateBooking).toISOString(),
        availableSlot: hourBooking,
        salonId: storeId,
        bookingDetail: bookingDetails,
      };
      dispatch(BookAppointment(data));
    }
  }, [storeId, services, hourBooking]);

  // useEffect(() => {
  //   if (bookAppoinment && bookAppoinment.bookingDetailResponses) {
  //     const timesArray = bookAppoinment.bookingDetailResponses.map(
  //       (detail) => ({
  //         id: detail.serviceHair.id,
  //         startTime: detail.serviceHair.startTime,
  //         endTime: detail.serviceHair.endTime,
  //         waitingTime: detail.serviceHair.waitingTime,
  //       })
  //     );

  //     const combinedData = services.map((service) => ({
  //       ...service,
  //       ...timesArray.find((time) => time.id === service.id),
  //     }));

  //     dispatch(setService(combinedData));
  //     console.log("data service", combinedData);
  //   }
  // }, [bookAppoinment]);

  return (
    <>
      <Loader visible={loading} />
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
              const date = new Date(day.dateString);
              setSelected(formatDate(date));
              setSelectedDate(formatDate(date));
              dispatch(setDateBooking(formatDate(date)));
              // dispatch(setDateBooking(day.dateString));
            }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: COLORS.primary,
                selectedTextColor: COLORS.secondary,
              },
            }}
            theme={{
              backgroundColor: COLORS.gray,
              calendarBackground: COLORS.lightWhite,
              textSectionTitleColor: "#00adf5",
              selectedDayBackgroundColor: COLORS.red,
              selectedDayTextColor: COLORS.black,
              todayTextColor: COLORS.red,
              dayTextColor: "#00adf5",
              textDisabledColor: COLORS.gray2,
            }}
            minDate={formatDate(minDate)}
            maxDate={formatDate(maxDate)}
          />
          {availableTime && availableTime.length > 0 ? (
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
              {availableTime?.map((item, index) => {
                // Chuyển đổi timeSlot thành giờ và phút
                const hours = Math.floor(item.timeSlot);
                const minutes = (item.timeSlot - hours) * 60;
                const timeString = `${hours}:${minutes === 0 ? "00" : minutes}`;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.item,
                      item.timeSlot === hourBooking
                        ? styles.selectedItem
                        : null,
                    ]}
                    onPress={() => {
                      dispatch(setHourBooking(item.timeSlot));
                    }}
                  >
                    <Text style={styles.text}>{timeString}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View
              style={{
                borderTopWidth: 0.5,
                borderTopColor: COLORS.gray2,
                paddingVertical: 10,
                marginVertical: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: COLORS.gray2,
              }}
            >
              <Text style={styles.text}>
                {error}
                {" vào ngày "}
                {selectedDate}
              </Text>
            </View>
          )}

          {/* <FlatList
          data={services}
          keyExtractor={(item) => item?.service_id.toString()}
          renderItem={({ item }) => <ListService item={item} />}
        /> */}
          <ListService />
          {availableTime && availableTime.length > 0 && (
            <TouchableOpacity
              style={styles.voucherButton}
              onPress={() => openModal()}
            >
              <Text style={styles.buttonVoucher}>+ Thêm dịch vụ</Text>
            </TouchableOpacity>
          )}

          {/* </ScrollView> */}

          <ListServiceModal isVisible={modalVisible} onClose={closeModal} />
          <VoucherModal
            isVisible={modalVoucherVisible}
            onClose={closeVoucherModal}
          />
        </SafeAreaView>
      </ScrollView>
      <View style={styles.bookContainer}>
        <View style={styles.bookPriceContainer}>
          <Text style={styles.priceText}>Total Price:</Text>
          <Text
            style={styles.priceText}
          >{`${totalPrice.toLocaleString()} VND`}</Text>
        </View>
        {/* <TouchableOpacity
          style={styles.voucherButton}
          onPress={() => openVoucherModal()}
        >
          <Text style={styles.buttonVoucher}>Thêm Voucher</Text>
        </TouchableOpacity> */}
        {voucher.length === 0 ? (
          <TouchableOpacity
            style={styles.voucherButton}
            onPress={() => openVoucherModal()}
          >
            <Text style={styles.buttonVoucher}>Thêm Voucher</Text>
          </TouchableOpacity>
        ) : (
          <View
            key={voucher?.id}
            style={styles.serviceItem}
            onPress={() => {
              // Handle navigation or other actions
            }}
          >
            <View style={styles.serviceInfo}>
              <TouchableOpacity style={styles.imageContainer}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/128/8074/8074470.png",
                  }}
                  resizeMode="cover"
                  style={styles.productImg}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.pricingInfo}>
              <Text style={styles.serviceName} numberOfLines={1}>
                {voucher?.code} {`(Giảm ${voucher?.discountPercentage * 100}%)`}
              </Text>
              <Text style={styles.serviceDescription} numberOfLines={1}>
                {voucher?.description}
              </Text>
              <Text
                style={styles.serviceDescription}
                numberOfLines={1}
              >{`Ngày hết hạn: ${voucher?.expiryDate?.split("T")[0]} `}</Text>
              {voucher?.isSystemCreated ? (
                <Text style={styles.serviceDescription} numberOfLines={3}>
                  Được tặng bởi HairHub
                </Text>
              ) : (
                <Text style={styles.serviceDescription} numberOfLines={3}>
                  Được tặng bởi Salon
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => openVoucherModal()}
            >
              <Text style={styles.button}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
        )}

        <Button title="Đặt Lịch" onPress={confirmBooking} />
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
    marginHorizontal: 10,
    marginTop: 5,
  },
  priceText: {
    fontSize: SIZES.medium,
    fontWeight: "bold",
  },
  voucherButton: {
    borderWidth: 2,
    borderColor: "#000", // Màu của border
    borderStyle: "dashed", // Kiểu nét đứt
    padding: 10,
    borderRadius: 5, // Đường cong của góc
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },
  buttonVoucher: {
    color: "#000", // Màu của text
    fontSize: 16,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 5,
    // marginHorizontal: SIZES.xSmall,
  },
  serviceInfo: {
    flex: 2, // 7 parts
    flexDirection: "column",
    marginRight: 10,
  },
  pricingInfo: {
    flex: 5, // 2 parts
    flexDirection: "column",
    alignItems: "flex-start", // Align text to right if needed
  },
  bookButton: {
    flex: 3, // 1 part
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
    fontSize: SIZES.xSmall,
  },
  servicePrice: {
    fontSize: SIZES.xSmall,
    fontWeight: "bold",
  },
  servicePrice2: {
    fontSize: SIZES.xSmall,
    textDecorationLine: "line-through",
  },
  imageContainer: {
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  productImg: {
    width: "100%",
    height: 65,
    borderRadius: SIZES.small,
  },
});
