import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  removeVoucher,
} from "../store/bookingStore/action";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/auth/Button";
import {
  GetAvailableTime,
  BookAppointment,
  resetAvailable,
  CalculatePrice,
  CreateAppointment,
} from "../store/booking/action";
import Loader from "../components/auth/Loader";
import { GetVoucherBySalonId } from "../store/voucher/action";
import VoucherModal from "../components/booking/VoucherModal";
import * as SecureStore from "expo-secure-store";
import { useNotificationScheduler } from "../hook/useNotificationScheduler";
import {
  startConnection,
  onEvent,
  sendEvent,
  stopConnection,
} from "../hook/signalRService";
import * as signalR from "@microsoft/signalr";
import { BookingService } from "../services/bookingService";
import { Alert } from "react-native";

const Booking = ({ navigation }) => {
  const dispatch = useDispatch();
  const { scheduleNotification, expoPushToken } = useNotificationScheduler();
  const scrollViewRef = useRef(null);
  const {
    storeId,
    dateBooking,
    hourBooking,
    services,
    // totalPrice,
    totalTime,
    voucher,
  } = useSelector((state) => state.booking);
  const {
    loading,
    availableTime,
    bookAppoinment,
    error,
    totalPrice,
    createAppointment,
  } = useSelector((state) => state.BOOKING);
  const { user, accountId } = useSelector((state) => state.USER);
  // console.log("availableTime", availableTime);
  // console.log("bookAppoinment", bookAppoinment?.bookingDetailResponses);
  // console.log("voucher:", voucher);
  // console.log("dateBooking", dateBooking);
  const canPressButton = availableTime && availableTime.length > 0;

  const warningBooking = () => {
    ToastAndroid.show(
      "Salon/Barber chưa thể nhận đặt lịch vào thời gian này!",
      ToastAndroid.SHORT
    );
  };

  const confirmBooking = () => {
    if (
      user &&
      user?.id &&
      bookAppoinment &&
      bookAppoinment.bookingDetailResponses &&
      totalPrice &&
      services &&
      accountId
    ) {
      Alert.alert(
        "Xác nhận trước khi đặt",
        `Hãy đảm bào ngày giờ và dịch vụ chính xác trước khi đặt`,
        [
          {
            text: "Hủy",
            style: "cancel",
          },
          {
            text: "Tiếp tục đặt lịch",
            onPress: () => {
              booking();
            },
          },
        ]
      );
    } else {
      ToastAndroid.show(
        "Lỗi đặt lịch, vui lòng thử lại sau!",
        ToastAndroid.SHORT
      );
    }
  };

  const booking = async () => {
    if (
      user &&
      user?.id &&
      bookAppoinment &&
      bookAppoinment.bookingDetailResponses &&
      totalPrice &&
      services &&
      accountId
    ) {
      await startConnection();
      const getRandomEmployeeId = (employees) => {
        if (employees.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * employees.length);
        return employees[randomIndex].id;
      };
      const createAppointmentObject = () => {
        const appointmentDetails = bookAppoinment.bookingDetailResponses.map(
          (detail) => {
            const service = services.find(
              (s) => s.id === detail.serviceHair.id
            );
            return {
              // salonEmployeeId: detail.employees[0].id,
              // salonEmployeeId:
              //   service.staff?.id !== "0"
              //     ? service.staff?.id
              //     : detail.employees[0].id,
              salonEmployeeId:
                service.staff?.id !== "0" && service.staff?.id
                  ? service.staff?.id
                  : getRandomEmployeeId(detail.employees),

              serviceHairId: service.id,
              description: service.description,
              endTime: detail.serviceHair.endTime,
              startTime: detail.serviceHair.startTime,
            };
          }
        );

        return {
          customerId: user?.id,
          startDate: bookAppoinment?.day,
          totalPrice: totalPrice.totalPrice,
          originalPrice: totalPrice.originalPrice,
          discountedPrice: totalPrice.discountedPrice,
          appointmentDetails: appointmentDetails,
          voucherIds: voucher ? [voucher.id] : [],
        };
      };
      const serviceHairIds = bookAppoinment.bookingDetailResponses.map(
        (detail) => detail.serviceHair.id
      );
      const appointmentObject = createAppointmentObject();
      // console.log(JSON.stringify(appointmentObject));
      // console.log(
      //   JSON.stringify(appointmentObject.appointmentDetails[0].startTime)
      // );
      let mappingData = {
        message: "send serviceId",
        dateAppointment: appointmentObject?.startDate,
        salonId: storeId,
        serviceId: serviceHairIds,
      };
      console.log("mappingData", mappingData);

      dispatch(
        CreateAppointment(
          appointmentObject,
          navigation,
          currentPage,
          itemsPerPage,
          accountId,
          scheduleNotification
        )
      );
      await BookingService.broadcastMessage(mappingData);
    } else {
      ToastAndroid.show(
        "Có lỗi xảy ra, vui lòng thử lại sau !",
        ToastAndroid.SHORT
      );
    }
    await stopConnection();
  };
  // console.log("createAppointment", createAppointment);
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
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  });

  useEffect(() => {
    let connection;
    const setupSignalR = async () => {
      try {
        // Create the SignalR connection
        connection = new signalR.HubConnectionBuilder()
          .withUrl("https://hairhub.gahonghac.net/book-appointment-hub")
          .withAutomaticReconnect()
          .build();

        // Start the connection
        await connection.start();

        // Set up the event listener directly inside useEffect
        connection.on(
          "ReceiveMessage",
          async (message, dateAppointment, datenow, salonId, serviceId) => {
            // Make sure selectedDate is properly defined
            if (!selectedDate) {
              console.error("selectedDate is not defined");
              return;
            }

            // Function to format the date
            // const formatDate = (date) => {
            //   const year = date.getFullYear();
            //   const month = String(date.getMonth() + 1).padStart(2, "0");
            //   const day = String(date.getDate()).padStart(2, "0");
            //   return ${year}-${month}-${day};
            // };

            // Format the date
            const formattedDate = formatDate(selectedDate);

            // Make sure the condition is valid before calling the API
            if (dateAppointment === formattedDate && salonId === storeId) {
              try {
                let data = {
                  day: new Date(dateBooking).toISOString(),
                  salonId: storeId,
                  serviceHairId: services[0]?.id,
                  salonEmployeeId:
                    services[0]?.staff?.id !== "0"
                      ? services[0]?.staff?.id
                      : null,
                  isAnyOne: services[0]?.staff?.id === "0",
                };
                await GetAvailableTime(data);
              } catch (error) {
                console.error("Error in fetchAvailable:", error);
              }
            }
          }
        );
      } catch (error) {
        console.error("Error setting up SignalR:", error);
      }
    };

    setupSignalR();

    // Clean up the connection when the component unmounts
    return () => {
      connection.stop().then(() => console.log("SignalR Disconnected."));
    };
  }, [selectedDate]);

  useEffect(() => {
    dispatch(GetVoucherBySalonId(storeId, currentPage, itemsPerPage));
  }, []);

  // useEffect(() => {
  //   // Bắt đầu kết nối
  //   startConnection();

  //   // Lắng nghe một sự kiện từ server
  //   onEvent("ReceiveMessage", (message) => {
  //     console.log("Received message: ", message);
  //   });

  //   // Clean up khi component bị unmount
  //   return () => {
  //     stopConnection();
  //   };
  // }, []);

  // useEffect(() => {
  //   dispatch(setDateBooking(selectedDate));
  //   if (availableTime.length > 0 && hourBooking < availableTime[0].timeSlot) {
  //     const firstTimeSlot = availableTime[0].timeSlot;
  //     dispatch(setHourBooking(firstTimeSlot));
  //   }
  //   // dispatch(GetVoucherBySalonId(storeId, currentPage, itemsPerPage));
  // }, [selectedDate, availableTime]);

  useEffect(() => {
    dispatch(setDateBooking(selectedDate));

    if (availableTime.length > 0) {
      const firstTimeSlot = availableTime[0].timeSlot;

      // Kiểm tra xem hourBooking có tồn tại trong availableTime hay không
      const hourExists = availableTime.some(
        (item) => item.timeSlot === hourBooking
      );

      if (!hourExists || hourBooking < firstTimeSlot) {
        dispatch(setHourBooking(firstTimeSlot));
      }
    }

    // dispatch(GetVoucherBySalonId(storeId, currentPage, itemsPerPage));
  }, [selectedDate, availableTime, hourBooking]);

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
    const hourExists = availableTime.some(
      (item) => item.timeSlot === hourBooking
    );
    console.log("hourExists", hourExists);

    if (hourExists && hourBooking && services.length > 0) {
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
  }, [storeId, services, hourBooking, dateBooking]);

  useEffect(() => {
    if (bookAppoinment && bookAppoinment.bookingDetailResponses) {
      const timesArray = bookAppoinment?.bookingDetailResponses?.map(
        (detail) => ({
          id: detail.serviceHair.id,
        })
      );
      const voucherId = voucher?.id ?? null;
      const serviceHairId = timesArray.map((item) => item.id);

      const result = {
        voucherId: voucherId,
        serviceHairId: serviceHairId,
      };
      // console.log("total price data", result);
      dispatch(CalculatePrice(result));
    }
  }, [voucher, bookAppoinment]);
  // console.log("totalPrice: ", totalPrice);

  useEffect(() => {
    if (availableTime && scrollViewRef.current) {
      const index = availableTime.findIndex(
        (item) => item.timeSlot === hourBooking
      );
      if (index !== -1) {
        scrollViewRef.current.scrollTo({
          x: index * 75, // Giá trị này có thể điều chỉnh tùy thuộc vào kích thước của mỗi item
          animated: true,
        });
      }
    }
  }, [hourBooking, availableTime]);

  return (
    <>
      <Loader visible={loading} />
      <ScrollView style={{ backgroundColor: "#f4f2eb" }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.upperRow}>
            <TouchableOpacity style={{ paddingLeft: 0 }} onPress={handleGoBack}>
              <Ionicons
                name="chevron-back-circle"
                size={30}
                color={COLORS.black}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Đặt lịch</Text>
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
              backgroundColor: "#bf9456",
              calendarBackground: COLORS.background,
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
          {/* {availableTime && availableTime.length > 0 ? (
            <ScrollView
              ref={scrollViewRef}
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
                // Chỉ hiển thị timeSlot nếu có employeeAvailables.length > 0
                if (item.employeeAvailables.length > 0) {
                  // Chuyển đổi timeSlot thành giờ và phút
                  const hours = Math.floor(item.timeSlot);
                  const minutes = (item.timeSlot - hours) * 60;
                  const timeString = `${hours}:${
                    minutes === 0 ? "00" : minutes
                  }`;

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
                } else {
                  return null;
                }
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
          )} */}

          {availableTime && availableTime.length > 0 ? (
            <ScrollView
              ref={scrollViewRef}
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
                // Chỉ hiển thị timeSlot nếu có employeeAvailables.length > 0
                if (item.employeeAvailables.length > 0) {
                  // Chuyển đổi timeSlot thành giờ và phút
                  const hours = Math.floor(item.timeSlot);
                  const minutes = (item.timeSlot - hours) * 60;
                  const timeString = `${hours}:${
                    minutes === 0 ? "00" : minutes
                  }`;

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
                } else {
                  return null;
                }
              })}
            </ScrollView>
          ) : error ? (
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
                {"Đã quá thời gian đặt lịch vào ngày "}
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
              style={styles.serviceButton}
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
          <Text style={styles.priceText}>Tổng tiền:</Text>
          {/* <Text
            style={styles.priceText}
          >{`${totalPrice?.originalPrice?.toLocaleString()} VND`}</Text> */}
          <View style={styles.pricingInfo}>
            {totalPrice?.originalPrice != totalPrice?.totalPrice ? (
              <>
                <Text style={styles.servicePrice} numberOfLines={1}>{`${
                  totalPrice?.totalPrice?.toLocaleString() ?? 0
                } VND`}</Text>
                <Text style={styles.servicePrice2} numberOfLines={1}>{`${
                  totalPrice?.originalPrice.toLocaleString() ?? 0
                } VND`}</Text>
              </>
            ) : (
              <>
                <Text style={styles.servicePrice} numberOfLines={1}>{`${
                  totalPrice?.totalPrice?.toLocaleString() ?? 0
                } VND`}</Text>
              </>
            )}
          </View>
        </View>
        {/* <TouchableOpacity
          style={styles.voucherButton}
          onPress={() => openVoucherModal()}
        >
          <Text style={styles.buttonVoucher}>Thêm Voucher</Text>
        </TouchableOpacity> */}
        {availableTime &&
          availableTime.length > 0 &&
          (voucher === null ? (
            <TouchableOpacity
              style={styles.voucherButton}
              onPress={() => openVoucherModal()}
            >
              <Text style={styles.buttonVoucher}>Thêm Voucher</Text>
            </TouchableOpacity>
          ) : (
            <View key={voucher?.id} style={styles.serviceItem}>
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
              <View style={styles.voucherInfo}>
                <Text style={styles.serviceName} numberOfLines={1}>
                  {voucher?.code}{" "}
                  {`(Giảm ${voucher?.discountPercentage * 100}%)`}
                </Text>
                <Text style={styles.serviceDescription} numberOfLines={1}>
                  {voucher?.description}
                </Text>
                <Text style={styles.serviceDescription} numberOfLines={1}>
                  {`Có giá trị ít nhất ${voucher?.minimumOrderAmount?.toLocaleString()} VND`}
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
                onPress={() => dispatch(removeVoucher())}
              >
                <Text style={styles.button}>Xóa</Text>
              </TouchableOpacity>
            </View>
          ))}
        {!canPressButton || bookAppoinment.length === 0 ? (
          <TouchableOpacity
            onPress={warningBooking}
            activeOpacity={0.7}
            style={styles.btnStyle}
          >
            <Text style={styles.textStyle}>Đặt Lịch</Text>
          </TouchableOpacity>
        ) : (
          <Button
            title="Đặt Lịch"
            onPress={confirmBooking}
            // onPress={canPressButton ? confirmBooking : warningBooking}
          />
        )}
      </View>
    </>
  );
};

export default Booking;

const styles = StyleSheet.create({
  container: {
    // marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
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
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.gray2,
    width: 65,
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
    backgroundColor: COLORS.cardcolor,
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
  serviceButton: {
    borderWidth: 2,
    borderColor: "#000", // Màu của border
    borderStyle: "dashed", // Kiểu nét đứt
    padding: 10,
    borderRadius: 5, // Đường cong của góc
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    marginVertical: 10,
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
    alignItems: "flex-end", // Align text to right if needed
  },
  voucherInfo: {
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
    color: COLORS.cardcolor,
  },
  serviceName: {
    fontSize: SIZES.small,
    fontWeight: "bold",
  },
  serviceDescription: {
    fontSize: SIZES.xSmall,
  },
  servicePrice: {
    fontSize: SIZES.medium,
    fontWeight: "bold",
  },
  servicePrice2: {
    fontSize: SIZES.small,
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
  btnStyle: {
    height: 50,
    width: "100%",
    backgroundColor: COLORS.gray2,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  textStyle: {
    color: COLORS.gray,
    fontWeight: "bold",
    fontSize: 18,
  },
});
