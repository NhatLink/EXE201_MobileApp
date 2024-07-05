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
import React, { useState, memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SHADOWS, SIZES, images } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../../utils/helper";
import OrderTile from "../../components/orders/OrderTile";
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import {
  CancelAppointmentByCustomer,
  resetAppointment,
} from "../../store/appointment/action";
const ListSchedule = React.memo(({ item }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // const [modalVisible, setModalVisible] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10);

  // const OnCancel = async (item) => {
  //   async function fetchData() {
  //     const accountId = await SecureStore.getItemAsync("accountId");
  //     const userInfoJson = await SecureStore.getItemAsync("userInfo");
  //     console.log("salon item", item.id);
  //     let userInfo = null;
  //     if (userInfoJson) {
  //       try {
  //         userInfo = JSON.parse(userInfoJson);
  //       } catch (error) {
  //         console.error("Error parsing userInfo", error);
  //       }
  //     }
  //     const data = {
  //       customerId: userInfo?.id,
  //       status: "CANCEL_BY_CUSTOMER",
  //     };
  //     if (item?.id && accountId && userInfo && userInfo?.id) {
  //       dispatch(
  //         CancelAppointmentByCustomer(
  //           item?.id,
  //           data,
  //           currentPage,
  //           itemsPerPage,
  //           accountId
  //         )
  //       );
  //     }
  //   }
  //   fetchData();
  //   setModalVisible(false); // Close modal after action
  // };
  const goToDetailAppointment = async () => {
    dispatch(resetAppointment());
    navigation.navigate("DetailAppointment", {
      appointmentId: item?.id,
    });
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerDate}>
          <View style={styles.line1} />
          <Text style={styles.text}>
            {item?.startDate?.split("T")[0]} /{" "}
            {item?.appointmentDetails[0]?.startTime?.split("T")[1]}
          </Text>
          <View style={styles.line} />
        </View>
        <View>
          <View style={styles.descriptionWrapper}>
            {/* <TouchableOpacity style={styles.imageContainer}>
              <Image
                source={{ uri: item?.salonInformation?.img }}
                resizeMode="cover"
                style={styles.productImg}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.Storedescription}
              onPress={() =>
                // navigation.navigate("Details", {
                //   product: item.salonInformation?.id,
                // })
                // navigation.navigate("DetailAppointment", {
                //   appointmentId: item?.id,
                // })
                {}
              }
            >
              <Text style={styles.description}>
                {item?.salonInformation?.name}
              </Text>
              <Text style={styles.descriptionText}>
                {item?.salonInformation?.description}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={goToDetailAppointment}
            >
              <Text style={styles.button}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
          {item?.appointmentDetails?.map((itemDetail) => (
            <View key={itemDetail?.id} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName} numberOfLines={1}>
                  {itemDetail?.serviceName}{" "}
                  {`(${itemDetail?.timeServiceHair * 60} Phút)`}
                </Text>
                <Text style={styles.serviceDescription} numberOfLines={1}>{`${
                  itemDetail?.startTime?.split("T")[1]
                } đến ${itemDetail?.endTime?.split("T")[1]} `}</Text>
              </View>
              <View style={styles.pricingInfo}>
                <Text
                  style={styles.servicePrice}
                  numberOfLines={1}
                >{`${itemDetail?.priceServiceHair?.toLocaleString()} VND`}</Text>
                <View style={styles.containerInfo}>
                  <View>
                    <Text style={styles.title}>
                      {itemDetail?.salonEmployee?.fullName}
                    </Text>
                  </View>
                  <Image
                    source={{ uri: itemDetail?.salonEmployee?.img }}
                    resizeMode="cover"
                    style={styles.avatar}
                  />
                </View>
              </View>
            </View>
          ))}
          <View style={styles.descriptionWrapper2}>
            <View style={styles.Storedescription}>
              <Text style={styles.description2}>Tổng tiền:</Text>
            </View>
            <TouchableOpacity style={styles.priceTime}>
              {item && item?.discountedPrice > 0 ? (
                <>
                  <Text style={styles.descriptionPrice} numberOfLines={1}>{`${
                    item?.totalPrice?.toLocaleString() ?? 0
                  } VND`}</Text>
                  <Text style={styles.servicePrice2} numberOfLines={1}>{`${
                    item?.originalPrice?.toLocaleString() ?? 0
                  } VND`}</Text>
                </>
              ) : (
                <Text style={styles.descriptionPrice} numberOfLines={1}>{`${
                  item?.totalPrice?.toLocaleString() ?? 0
                } VND`}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTextTitle}>
              Bạn muốn hủy lịch hẹn vào {item?.startDate?.split("T")[0]} /{" "}
              {item?.appointmentDetails[0]?.startTime?.split("T")[1]}
            </Text>
            <View style={styles.containerInfo}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.button1}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => OnCancel(item)}>
                <Text style={styles.button1}>Tiếp tục</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
    </>
  );
});

export default memo(ListSchedule);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    // ...SHADOWS.medium,
    position: "relative",
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    // borderWidth: 0.5,
    // borderColor: COLORS.black,
  },
  container2: {
    backgroundColor: "#FFF",
    // ...SHADOWS.medium,
    position: "relative",
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    paddingVertical: 30,
    // borderWidth: 0.5,
    // borderColor: COLORS.black,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 5,
    // marginHorizontal: SIZES.xSmall,
  },
  serviceInfo: {
    flex: 5, // 7 parts
    flexDirection: "column",
  },
  pricingInfo: {
    flex: 5, // 2 parts
    flexDirection: "column",
    alignItems: "flex-end", // Align text to right if needed
  },
  Storedescription: {
    flex: 5,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: SIZES.small,
  },
  bookButton: {
    flex: 2,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  priceTime: {
    flex: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: COLORS.tertiary,
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
    marginTop: 5,
  },
  servicePrice: {
    fontSize: SIZES.xSmall,
    fontWeight: "bold",
  },
  servicePrice2: {
    fontSize: SIZES.xSmall,
    textDecorationLine: "line-through",
  },
  description: {
    fontWeight: "bold",
    fontSize: SIZES.large - 2,
  },
  descriptionWrapper: {
    marginTop: SIZES.medium,
    // marginHorizontal: SIZES.large,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.black,
  },
  descriptionText: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    textAlign: "justify",
    marginBottom: SIZES.small,
  },
  imageContainer: {
    marginBottom: 5,
    width: 70,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  productImg: {
    width: "100%",
    height: 65,
    borderRadius: SIZES.small,
  },
  description2: {
    fontWeight: "bold",
    textAlign: "left",
    fontSize: SIZES.large - 2,
  },
  descriptionWrapper2: {
    marginTop: SIZES.small,
    // marginHorizontal: SIZES.large,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.black,
  },
  descriptionText2: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    textAlign: "justify",
    marginBottom: SIZES.small,
  },
  descriptionPrice: {
    fontWeight: "bold",
    textAlign: "right",
    fontSize: SIZES.large - 2,
  },
  descriptionTextTime: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    textAlign: "right",
    marginBottom: SIZES.small,
  },
  containerDate: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  line: {
    flex: 8,
    height: 1,
    backgroundColor: COLORS.gray,
  },
  line1: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray,
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  containerInfo: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5,
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 999,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  title: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: SIZES.small,
    marginHorizontal: 5,
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTextTitle: {
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: SIZES.medium,
    marginLeft: 10,
  },
  button1: {
    backgroundColor: COLORS.primary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: "bold",
    color: COLORS.lightWhite,
  },
});
