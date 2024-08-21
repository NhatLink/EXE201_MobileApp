import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, SHADOWS } from "../../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import formatDate from "../../utils/helper";
import { baseUrl } from "../../utils/IP";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Rating } from "react-native-ratings";
import fetchOrders from "../../hook/fetchOrders";
import { useNavigation } from "@react-navigation/native";
import { resetAppointment } from "../../store/appointment/action";
import { useDispatch } from "react-redux";
const OrderTile = ({ item }) => {
  const dispatch = useDispatch();
  const [responseData, setResponseData] = useState(null);
  const [contentFeedback, setContentFeedback] = useState("");
  const [ratingFeedback, setRatingFeedback] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data, isLoading, error, refetch } = fetchOrders();
  const navigation = useNavigation();
  const AddFeedback = async () => {};
  const goToDetailAppointment = () => {
    dispatch(resetAppointment());
    navigation.navigate("DetailAppointment", {
      appointmentId: item?.id,
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "SUCCESSED":
        return "Thành công";
      case "CANCEL_BY_CUSTOMER":
        return "Đã hủy";
      case "FAILED":
        return "Thất bại";
      default:
        return "Không xác định";
    }
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
            <View style={styles.Storedescription}>
              <Text style={styles.description2}>Trạng thái lịch hẹn: </Text>
            </View>
            <View style={styles.priceTime}>
              <Text style={styles.descriptionPrice} numberOfLines={1}>
                {getStatusText(item?.status)}
              </Text>
            </View>
          </View>
          <View style={styles.descriptionWrapper}>
            <TouchableOpacity style={styles.imageContainer}>
              <Image
                source={{ uri: item?.salonInformation?.img }}
                resizeMode="cover"
                style={styles.productImg}
              />
            </TouchableOpacity>
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
            <View style={styles.priceTime}>
              {item?.discountedPrice > 0 ? (
                <>
                  <Text
                    style={styles.descriptionPrice}
                    numberOfLines={1}
                  >{`${item?.totalPrice?.toLocaleString()} VND`}</Text>
                  <Text
                    style={styles.servicePrice2}
                    numberOfLines={1}
                  >{`${item?.originalPrice?.toLocaleString()} VND`}</Text>
                </>
              ) : (
                <Text
                  style={styles.descriptionPrice}
                  numberOfLines={1}
                >{`${item?.totalPrice?.toLocaleString()} VND`}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default OrderTile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardcolor,
    // ...SHADOWS.medium,
    position: "relative",
    borderRadius: 10,
    // marginVertical: 5,
    paddingHorizontal: 10,
    // marginHorizontal: 15,
    borderWidth: 0.5,
    borderColor: COLORS.black,
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
    marginVertical: 10,
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
    marginRight: 5,
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

  descriptionPrice: {
    fontWeight: "bold",
    textAlign: "right",
    fontSize: SIZES.large - 2,
    marginRight: 5,
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
});
