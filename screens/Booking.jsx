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

const Booking = ({ navigation }) => {
  const dispatch = useDispatch();
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
  console.log("availableTime", availableTime);
  // console.log("bookAppoinment", bookAppoinment?.bookingDetailResponses);
  // console.log("voucher:", voucher);
  console.log("dateBooking", dateBooking);
  const canPressButton = availableTime && availableTime.length > 0;
  const confirmBooking = async () => {
    // const userInfoJson = await SecureStore.getItemAsync("userInfo");
    // const accountId = await SecureStore.getItemAsync("accountId");
    // let userInfo = null;
    // if (userInfoJson) {
    //   try {
    //     userInfo = JSON.parse(userInfoJson);
    //   } catch (error) {
    //     console.error("Error parsing userInfo", error);
    //   }
    // }

    if (
      user &&
      user?.id &&
      bookAppoinment &&
      bookAppoinment.bookingDetailResponses &&
      totalPrice &&
      services &&
      accountId
    ) {
      const createAppointmentObject = () => {
        const appointmentDetails = bookAppoinment.bookingDetailResponses.map(
          (detail) => {
            const service = services.find(
              (s) => s.id === detail.serviceHair.id
            );
            return {
              // salonEmployeeId: detail.employees[0].id,
              salonEmployeeId:
                service.staff?.id !== "0"
                  ? service.staff?.id
                  : detail.employees[0].id,
              serviceHairId: service.id,
              description: service.description,
              endTime: detail.serviceHair.endTime,
              startTime: detail.serviceHair.startTime,
            };
          }
        );

        return {
          customerId: userInfo?.id,
          startDate: bookAppoinment?.day,
          totalPrice: totalPrice.totalPrice,
          originalPrice: totalPrice.originalPrice,
          discountedPrice: totalPrice.discountedPrice,
          appointmentDetails: appointmentDetails,
          voucherIds: voucher ? [voucher.id] : [],
        };
      };

      const appointmentObject = createAppointmentObject();
      console.log(JSON.stringify(appointmentObject));
      dispatch(
        CreateAppointment(
          appointmentObject,
          navigation,
          currentPage,
          itemsPerPage,
          accountId
        )
      );
    }
  };
  console.log("createAppointment", createAppointment);
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
    dispatch(GetVoucherBySalonId(storeId, currentPage, itemsPerPage));
  }, []);

  useEffect(() => {
    dispatch(setDateBooking(selectedDate));
    if (availableTime.length > 0 && hourBooking < availableTime[0].timeSlot) {
      const firstTimeSlot = availableTime[0].timeSlot;
      dispatch(setHourBooking(firstTimeSlot));
    }
    // dispatch(GetVoucherBySalonId(storeId, currentPage, itemsPerPage));
  }, [selectedDate, availableTime]);

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
                <Text
                  style={styles.servicePrice}
                  numberOfLines={1}
                >{`${totalPrice?.totalPrice?.toLocaleString()} VND`}</Text>
                <Text
                  style={styles.servicePrice2}
                  numberOfLines={1}
                >{`${totalPrice?.originalPrice.toLocaleString()} VND`}</Text>
              </>
            ) : (
              <>
                <Text
                  style={styles.servicePrice}
                  numberOfLines={1}
                >{`${totalPrice?.totalPrice?.toLocaleString()} VND`}</Text>
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
        <Button
          title="Đặt Lịch"
          // onPress={confirmBooking}
          onPress={canPressButton ? confirmBooking : null}
        />
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
});
