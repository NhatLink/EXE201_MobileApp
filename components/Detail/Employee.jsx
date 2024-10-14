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
  TextInput,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, images } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../../utils/helper";
import OrderTile from "../../components/orders/OrderTile";
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addService,
  setStoreId,
  resetBooking,
} from "../../store/bookingStore/action";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";
import { resetAvailable } from "../../store/booking/action";
import { fetchSalonEmployeeBySalonInformationId } from "../../store/salon/action";
const Employee = (storeId) => {
  const navigation = useNavigation();
  const { salonService, salonEmployee } = useSelector((state) => state.SALON);
  const { isAuthenticated } = useSelector((state) => state.USER);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [filterKey, setFilterKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const dispatch = useDispatch();

  useEffect(() => {
    if (storeId && storeId.storeId) {
      dispatch(
        fetchSalonEmployeeBySalonInformationId(
          storeId.storeId,
          currentPage,
          itemsPerPage,
          filterKey
        )
      );
    }
  }, [storeId.storeId, currentPage, itemsPerPage, filterKey]);

  // const handleBook = async (storeId, item) => {
  //   closeModal();
  //   try {
  //     // const accessToken = await SecureStore.getItemAsync("accessToken");
  //     if (isAuthenticated) {
  //       dispatch(resetBooking());
  //       dispatch(resetAvailable());
  //       dispatch(setStoreId(storeId?.storeId));
  //       dispatch(addService(item));
  //       // Điều hướng hoặc logic bổ sung
  //       navigation.navigate("Booking");
  //     } else {
  //       throw new Error("Access token không tồn tại");
  //     }
  //   } catch (error) {
  //     console.log("Lỗi trong handleBook:", error);
  //     ToastAndroid.show(
  //       "Vui lòng đăng nhập để sử dụng tính năng trên",
  //       ToastAndroid.SHORT
  //     );
  //   }
  // };
  const handleBook = async (storeId, item) => {
    if (isAuthenticated) {
      closeModal();
      // Người dùng đã đăng nhập
      await dispatch(resetBooking());
      await dispatch(resetAvailable());
      await dispatch(setStoreId(storeId?.storeId));
      await dispatch(addService(item));
      // Điều hướng hoặc logic bổ sung
      navigation.navigate("Booking");
    } else {
      // Người dùng chưa đăng nhập
      ToastAndroid.show(
        "Vui lòng đăng nhập để sử dụng tính năng trên",
        ToastAndroid.SHORT
      );
    }
  };

  const daysOfWeekMap = {
    Monday: "Thứ Hai",
    Tuesday: "Thứ Ba",
    Wednesday: "Thứ Tư",
    Thursday: "Thứ Năm",
    Friday: "Thứ Sáu",
    Saturday: "Thứ Bảy",
    Sunday: "Chủ Nhật",
  };

  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const genderMap = {
    Male: "Nam",
    Female: "Nữ",
    Other: "Khác",
  };

  const sortedSchedules = selectedService?.schedules?.sort(
    (a, b) => daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek)
  );

  const openModal = (service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedService(null);
  };
  const handleSearch = () => {
    Keyboard.dismiss();
    setFilterKey(searchKey);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.searchContainer}>
          <TouchableOpacity>
            <Feather
              style={styles.searchIcon}
              name="scissors"
              size={SIZES.medium}
              color="black"
            />
          </TouchableOpacity>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              value={searchKey}
              onChangeText={setSearchKey}
              placeholder="Bạn đang tìm nhân viên nào?"
            />
          </View>

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Ionicons
              name="search"
              size={SIZES.medium}
              color={COLORS.offwhite}
            />
          </TouchableOpacity>
        </View>
        {salonEmployee?.items?.length === 0 ? (
          <Text style={styles.modalTextTitle}>
            Không tìm thấy nhân viên nào
          </Text>
        ) : (
          salonEmployee?.items?.map((item) => (
            <View
              key={item.id}
              style={styles.serviceItem}
              onPress={() => {
                // Handle navigation or other actions
              }}
            >
              <View style={styles.imgService}>
                <Image source={{ uri: item?.img }} style={styles.image} />
              </View>
              <TouchableOpacity
                style={styles.serviceInfo}
                // onPress={() => openModal(item)}
              >
                <Text style={styles.serviceName} numberOfLines={1}>
                  {item?.fullName}
                </Text>
                <Text style={styles.serviceDescription} numberOfLines={1}>
                  Giới tính: {genderMap[item?.gender]}
                </Text>
              </TouchableOpacity>
              {/* <View style={styles.pricingInfo}>
              {item?.reducePrice ? (
                <>
                  <Text
                    style={styles.servicePrice}
                    numberOfLines={1}
                  >{`${item?.reducePrice?.toLocaleString()} VND`}</Text>
                  <Text
                    style={styles.servicePrice2}
                    numberOfLines={1}
                  >{`${item?.price?.toLocaleString()} VND`}</Text>
                </>
              ) : (
                <>
                  <Text
                    style={styles.servicePrice}
                    numberOfLines={1}
                  >{`${item?.price?.toLocaleString()} VND`}</Text>
                </>
              )}

              <Text style={styles.serviceDescription} numberOfLines={1}>{`${
                item?.time * 60
              } phút`}</Text>
            </View> */}
              <TouchableOpacity
                style={styles.bookButton}
                //   onPress={() => handleBook(storeId, item)}
                onPress={() => openModal(item)}
              >
                <Text style={styles.button}>Chi tiết </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        {salonEmployee?.total > salonEmployee?.size && (
          <TouchableOpacity onPress={() => setItemsPerPage(itemsPerPage + 4)}>
            <Text style={styles.loadmoreButton}>Hiện thị thêm nhân viên</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false} // Set transparent to false to use the full screen
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <ScrollView style={styles.fullScreenModal}>
          <View style={styles.imgService}>
            <Image
              source={{ uri: selectedService?.img }}
              style={styles.image}
            />
          </View>
          <Text style={styles.modalTextTitle}>{selectedService?.fullName}</Text>
          <Text style={styles.modalText}>
            Giới tính: {genderMap[selectedService?.gender]}
          </Text>
          {/* <View> */}
          <Text style={styles.modalTextTitle}>Ngày giờ làm việc:</Text>
          {sortedSchedules?.map((item) => (
            <View
              key={item.id} // Sử dụng id thay vì dayOfWeek để đảm bảo key là duy nhất
              style={styles.serviceItem}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName} numberOfLines={1}>
                  {daysOfWeekMap[item.dayOfWeek]}{" "}
                  {/* Chuyển đổi ngày từ tiếng Anh sang tiếng Việt */}
                </Text>
              </View>
              <View style={styles.pricingInfo}>
                {item.isActive ? (
                  <Text style={styles.servicePrice} numberOfLines={2}>
                    {item.startTime} - {item.endTime}
                  </Text>
                ) : (
                  <Text style={styles.servicePrice} numberOfLines={1}>
                    Không làm việc
                  </Text>
                )}
              </View>
            </View>
          ))}
          <Text style={styles.modalTextTitle}>Dịch vụ phục vụ:</Text>
          {selectedService?.serviceHairs.length === 0 ? (
            <Text style={styles.modalTextTitle}>
              Nhân viên không có dịch vụ phục vụ nào
            </Text>
          ) : (
            selectedService?.serviceHairs?.map((item) => (
              <View
                key={item.id}
                style={styles.serviceItem}
                onPress={() => {
                  // Handle navigation or other actions
                }}
              >
                <View style={styles.imgService}>
                  <Image source={{ uri: item?.img }} style={styles.image} />
                </View>
                <TouchableOpacity
                  style={styles.serviceInfo}
                  // onPress={() => openModal(item)}
                >
                  <Text style={styles.serviceName} numberOfLines={1}>
                    {item?.serviceName}
                  </Text>
                  <Text style={styles.serviceDescription} numberOfLines={1}>
                    {item?.description}
                  </Text>
                </TouchableOpacity>
                <View style={styles.pricingInfo}>
                  {item?.reducePrice ? (
                    <>
                      <Text
                        style={styles.servicePrice}
                        numberOfLines={1}
                      >{`${item?.reducePrice?.toLocaleString()} VND`}</Text>
                      <Text
                        style={styles.servicePrice2}
                        numberOfLines={1}
                      >{`${item?.price?.toLocaleString()} VND`}</Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={styles.servicePrice}
                        numberOfLines={1}
                      >{`${item?.price?.toLocaleString()} VND`}</Text>
                    </>
                  )}

                  <Text style={styles.serviceDescription} numberOfLines={1}>{`${
                    item?.time * 60
                  } phút`}</Text>
                </View>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBook(storeId, item)}
                >
                  <Text style={styles.button}>Đặt</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
        {/* </View> */}
        <TouchableOpacity style={styles.buttonClose} onPress={closeModal}>
          <Text style={styles.textStyle}>Đóng</Text>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Employee;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.background,
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
    fontSize: SIZES.medium,
    fontWeight: "bold",
    paddingTop: SIZES.small,
    paddingLeft: SIZES.xLarge,
    marginBottom: SIZES.xSmall,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 5,
    backgroundColor: COLORS.cardcolor,
    // marginHorizontal: SIZES.xSmall,
  },
  serviceInfo: {
    flex: 4, // 7 parts
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
  imgService: {
    flex: 2, // 1 part
    height: "100%",
    marginRight: 5,
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
  fullScreenModal: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    marginLeft: 10,
    fontSize: SIZES.small,
  },
  modalTextTitle: {
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "left",
    marginLeft: 10,
    fontSize: SIZES.medium,
  },
  buttonClose: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    backgroundColor: COLORS.cardcolor,
    borderRadius: 10,
    borderColor: COLORS.secondary,
    borderWidth: 2,
  },
  textStyle: {
    color: COLORS.black,
    fontWeight: "bold",
    textAlign: "center",
  },
  carouselContainer: {
    marginBottom: 10,
    height: "28%",
    alignItems: "center",
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.cardcolor,
    borderRadius: SIZES.medium,
    marginHorizontal: SIZES.small,
    height: 30,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.cardcolor,
    marginLeft: SIZES.xSmall,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.xSmall,
    height: "100%",
  },
  searchInput: {
    // fontFamily: "regular",
    fontSize: SIZES.small,
    width: "100%",
    height: "100%",
    // paddingHorizontal: SIZES.xSmall,
  },
  searchIcon: {
    marginLeft: 10,
    color: "gray",
  },
  searchBtn: {
    width: "auto",
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: SIZES.small,
  },
  loadmoreButton: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 3,
    marginVertical: 20,
    marginHorizontal: 40,
    borderRadius: 10,
    fontWeight: "bold",
  },
});
