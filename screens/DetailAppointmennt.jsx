import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Button,
} from "react-native";
import {
  SimpleLineIcons,
  Ionicons,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import BackButton from "../components/auth/BackButton";
import { COLORS, SIZES, images } from "../constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/IP";
import formatDate from "../utils/helper";
import { Rating } from "react-native-ratings";
import {
  CancelAppointmentByCustomer,
  GetAppointmentById,
} from "../store/appointment/action";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/auth/Loader";
import * as SecureStore from "expo-secure-store";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import CustomMarker from "../components/CustomMarker";
import { ReportAppointmentModal, StarRating } from "../components";
import CancelAppointmentModal from "../components/DetailAppointment/CancelAppointmentModal";
import FeedbackAppointmentModal from "../components/DetailAppointment/FeedbackAppointmentModal";

const GOOGLE_API_KEY = "AIzaSyDlTsepg9uGzgzICoP-q9G8vQ5diNQTsYM";
const DetailAppointmennt = ({ navigation }) => {
  const route = useRoute();
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const { appointmentId } = route.params;
  const [data, setData] = useState({});
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [contentFeedback, setContentFeedback] = useState("");
  const [ratingFeedback, setRatingFeedback] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const { appointmentDetail, feedbackAppointment, loading } = useSelector(
    (state) => state.APPOINTMENT
  );
  const { user, accountId } = useSelector((state) => state.USER);
  useEffect(() => {
    if (appointmentId) {
      dispatch(GetAppointmentById(appointmentId));
    }
  }, [appointmentId]);

  const OnCancel = async (reason) => {
    async function fetchData() {
      setLoad(true);
      // const accountId = await SecureStore.getItemAsync("accountId");
      // const userInfoJson = await SecureStore.getItemAsync("userInfo");
      // let userInfo = null;
      // if (userInfoJson) {
      //   try {
      //     userInfo = JSON.parse(userInfoJson);
      //   } catch (error) {
      //     console.error("Error parsing userInfo", error);
      //   }
      // }
      const data = {
        customerId: user?.id,
        reasonCancel: reason,
      };

      if (appointmentDetail?.id && accountId && user && user?.id) {
        await dispatch(
          CancelAppointmentByCustomer(
            appointmentDetail?.id,
            data,
            currentPage,
            itemsPerPage,
            accountId,
            navigation
          )
        );
      }
      setLoad(false);
    }
    fetchData();
    setModalVisible1(false);
  };

  const AddFeedback = async () => {
    setLoad(true);
    try {
      const id = await AsyncStorage.getItem("id");
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!id || !accessToken) {
        throw new Error("Authentication required.");
      }
      const instance = axios.create({
        headers: { Authorization: `Bearer ${JSON.parse(accessToken)}` },
      });

      const endpoint = `${baseUrl}/feedback/addFeedback`;
      const data = {
        productId: item?.order?.product_id._id,
        userId: JSON.parse(id),
        orderId: item?.order?._id,
        content: contentFeedback,
        rating: ratingFeedback,
      };
      const response = await instance.post(endpoint, data);
      if (response.status === 201) {
        refetch;
        setResponseData(response.data);
        Alert.alert("Feedback add successfully");
        setModalVisible(false);
        navigation.navigate("Details", {
          product: item?.order?.product_id?._id,
        });
      }
    } catch (error) {
      console.error("Feedback error: ", error);
      Alert.alert("Failed", error.message);
    } finally {
      setLoad(false);
    }
  };
  const [destination, setDestination] = useState({
    latitude: 10.875123789279687,
    longitude: 106.79814847509016,
  });
  const [origin, setOrigin] = useState({
    latitude: 10.762622, // Vị trí mặc định tại TP Hồ Chí Minh
    longitude: 106.660172,
  });
  const [routeRoad, setRoute] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const today = new Date();
  const startDate = new Date(appointmentDetail?.startDate);
  const differenceInTime = today.getTime() - startDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setOrigin({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (appointmentDetail && appointmentDetail?.salonInformation) {
      setDestination({
        latitude: parseFloat(appointmentDetail?.salonInformation?.latitude),
        longitude: parseFloat(appointmentDetail?.salonInformation?.longitude),
      });
    }
  }, [appointmentDetail]);

  const getDirections = async () => {
    if (!origin) return;
    const originString = `${origin.latitude},${origin.longitude}`;
    const destinationString = `${destination.latitude},${destination.longitude}`;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originString}&destination=${destinationString}&key=${GOOGLE_API_KEY}`
      );
      // console.log(
      //   `https://maps.googleapis.com/maps/api/directions/json?origin=${originString}&destination=${destinationString}&key=${GOOGLE_API_KEY}`
      // );
      const route = response.data.routes[0];
      const leg = route.legs[0];

      setDistance(leg.distance.text);
      setDuration(leg.duration.text);
      setStartAddress(leg.start_address);
      setEndAddress(leg.end_address);
      setModalVisible2(true);
      const points = decode(route.overview_polyline.points);
      const validPoints = points.filter(
        (point) => !isNaN(point.latitude) && !isNaN(point.longitude)
      );
      setRoute(validPoints);
    } catch (error) {
      console.error("Error getting directions:", error);
      Alert.alert("Error", "Unable to retrieve directions. Please try again.");
    }
  };

  const decode = (t, e) => {
    let d = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      d.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return d;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.upperRow}>
          <TouchableOpacity
            style={{ paddingLeft: 0 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-circle"
              size={30}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <View style={styles.productRow}>
            <Text style={styles.title}> Thông tin đơn đặt lịch</Text>
            {/* <TouchableOpacity style={styles.title} onPress={() => {}}>
              <Ionicons
                name="ellipsis-vertical-outline"
                size={30}
                color={COLORS.black}
              />
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (appointmentDetail === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.upperRow}>
          <TouchableOpacity
            style={{ paddingLeft: 0 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-circle"
              size={30}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <View style={styles.productRow}>
            <Text style={styles.title}> Thông tin đơn đặt lịch</Text>
            {/* <TouchableOpacity style={styles.title} onPress={() => {}}>
              <Ionicons
                name="ellipsis-vertical-outline"
                size={30}
                color={COLORS.black}
              />
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }
  const toggleModal3 = () => {
    setModalVisible3(!modalVisible3);
  };
  const getStatusText = (status) => {
    switch (status) {
      case "BOOKING":
        return "Đặt trước";
      case "SUCCESSED":
        return "Thành công";
      case "FAILED":
        return "Thất bại";
      case "CANCEL_BY_CUSTOMER":
        return "Hủy bởi khách hàng";
      default:
        return "Trạng thái không xác định"; // Optional, for handling any unexpected statuses
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <View style={styles.productRow}>
          <Text style={styles.title}> Thông tin đơn đặt lịch</Text>
          {/* <TouchableOpacity style={styles.title} onPress={() => {}}>
            <Ionicons
              name="ellipsis-vertical-outline"
              size={30}
              color={COLORS.black}
            />
          </TouchableOpacity> */}
        </View>
      </View>
      {/* <Loader visible={load} /> */}
      <ScrollView
        style={styles.containerinfo}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <View style={styles.sectionRow1}>
            <Text style={styles.header}>Trạng thái</Text>
            {appointmentDetail &&
            appointmentDetail?.status !== "BOOKING" ? null : (
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => setModalVisible1(true)}
              >
                <Text style={styles.button}>Hủy lịch hẹn</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.line} />
          {appointmentDetail && appointmentDetail?.status && (
            <View>
              <Text style={styles.contentHeader}>
                {getStatusText(appointmentDetail?.status)}
              </Text>
              {appointmentDetail && appointmentDetail?.reasonCancel && (
                <Text
                  style={styles.content}
                >{`Lý do hủy lịch: ${appointmentDetail?.reasonCancel}`}</Text>
              )}
              <Text style={styles.content}>Thời gian bắt đầu dịch vụ:</Text>
              <Text style={styles.content}>
                {appointmentDetail?.startDate?.split("T")[0]} /{" "}
                {
                  appointmentDetail?.appointmentDetails[0]?.startTime?.split(
                    "T"
                  )[1]
                }
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionRow}>
          <View style={styles.column}>
            <View style={styles.sectionRow1}>
              <Text style={styles.header}>Thông tin Salon/Barber</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Details", {
                    product: appointmentDetail?.salonInformation?.id,
                  })
                }
                // style={styles.checkoutBtn}
              >
                <Text style={styles.checkOutText1}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            <Image
              source={{ uri: appointmentDetail?.salonInformation?.img }}
              style={styles.ImageShop}
            />
            <View style={styles.productRow}>
              <View style={styles.productInfo2}>
                <Text style={styles.contentHeader}>
                  Cửa hàng: {appointmentDetail?.salonInformation?.name}
                </Text>
                <Text style={styles.content}>
                  Địa chỉ: {appointmentDetail?.salonInformation?.address}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={toggleModal3}
              >
                <Ionicons
                  name="warning-outline"
                  size={20}
                  color={COLORS.tertiary}
                  style={styles.buttonReport}
                />
              </TouchableOpacity>
            </View>

            {/* <Button title="Get Directions" onPress={getDirections} /> */}
            <TouchableOpacity style={styles.button1} onPress={getDirections}>
              <Ionicons name="locate" size={30} color={COLORS.lightWhite} />
              <Text style={styles.textStyle}>Chỉ đường</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionRow1}>
            <Text style={styles.header}>Thông tin đơn</Text>
            {appointmentDetail?.isFeedback === true ? (
              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => setModalVisible4(true)}
              >
                <Text style={styles.checkOutText}>Xem đánh giá</Text>
              </TouchableOpacity>
            ) : appointmentDetail?.status === "SUCCESSED" ? (
              differenceInDays > 3 ? (
                <Text style={styles.checkOutText}>Quá hạn đánh giá</Text>
              ) : (
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.checkOutText}>Đánh giá</Text>
                </TouchableOpacity>
              )
            ) : null}
          </View>

          <View style={styles.line} />
          {appointmentDetail?.appointmentDetails?.map((itemDetail) => (
            <View key={itemDetail?.id} style={styles.serviceItem}>
              <Image
                source={{ uri: itemDetail?.imgServiceHair }}
                style={styles.productImage}
              />
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
                    <Text style={styles.titleService}>
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
              {appointmentDetail?.discountedPrice > 0 ? (
                <>
                  <Text
                    style={styles.descriptionPrice}
                    numberOfLines={1}
                  >{`${appointmentDetail?.totalPrice?.toLocaleString()} VND`}</Text>
                  <Text
                    style={styles.servicePrice2}
                    numberOfLines={1}
                  >{`${appointmentDetail?.originalPrice?.toLocaleString()} VND`}</Text>
                </>
              ) : (
                <Text
                  style={styles.descriptionPrice}
                  numberOfLines={1}
                >{`${appointmentDetail?.totalPrice?.toLocaleString()} VND`}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              onChangeText={setContentFeedback}
              value={contentFeedback}
              placeholder="Enter your feedback"
            />
            <Rating
              ratingCount={5}
              imageSize={40}
              onFinishRating={setRatingFeedback}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={AddFeedback}>
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible4}
        onRequestClose={() => {
          setModalVisible4(!modalVisible4);
        }}
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.modalContainer}>
            <View style={styles.feedback}>
              <View style={styles.reviewContainer}>
                <View style={styles.imageContainer}>
                  {/* Check spelling here if it's really `imageContanner` */}
                  <Image
                    source={{ uri: feedbackAppointment?.customer?.img }}
                    style={styles.image}
                  />
                </View>
                <View style={styles.avatarContainer}>
                  <Text style={styles.author}>
                    {feedbackAppointment?.customer?.fullName}
                  </Text>
                  <Text style={styles.date}>
                    {feedbackAppointment?.createDate?.split("T")[0]} -{" "}
                    {
                      feedbackAppointment?.createDate
                        ?.split("T")[1]
                        ?.split(".")[0]
                    }
                  </Text>
                </View>
              </View>
              <Text style={styles.author}>
                Dịch vụ đã dùng:{" "}
                {feedbackAppointment?.appointment?.appointmentDetails?.length >
                0
                  ? feedbackAppointment.appointment.appointmentDetails
                      .map((detail) => detail.serviceName)
                      .join(", ")
                  : "Không có dịch vụ nào"}
              </Text>

              <StarRating rating={feedbackAppointment?.rating} />
              <Text style={styles.feedbackText}>
                {feedbackAppointment?.comment}
              </Text>
              <View horizontal style={styles.imageContainerService}>
                {feedbackAppointment?.fileFeedbacks?.map((image, index) => (
                  <View key={index} style={styles.imageWrapperService}>
                    <Image
                      source={{ uri: image.img }}
                      style={styles.imageService}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(!modalVisible2);
        }}
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.mapContainer}>
            {appointmentDetail &&
              appointmentDetail?.salonInformation?.latitude &&
              appointmentDetail?.salonInformation?.longitude && (
                <MapView
                  style={styles.map}
                  provider={MapView.PROVIDER_GOOGLE}
                  initialRegion={{
                    latitude: parseFloat(
                      appointmentDetail?.salonInformation?.latitude
                    ),
                    longitude: parseFloat(
                      appointmentDetail?.salonInformation?.longitude
                    ),
                    // latitude: 10.875123789279687,
                    // longitude: 106.79814847509016,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  {origin && (
                    // <Marker
                    //   coordinate={origin}
                    //   title="Your Location"
                    //   image={user?.img}
                    // />

                    <CustomMarker
                      coordinate={origin}
                      image={user?.img}
                      title="Your Location"
                    />
                  )}
                  <CustomMarker
                    coordinate={{
                      latitude: parseFloat(
                        appointmentDetail?.salonInformation?.latitude
                      ),
                      longitude: parseFloat(
                        appointmentDetail?.salonInformation?.longitude
                      ),
                    }}
                    image={appointmentDetail?.salonInformation?.img}
                    title={appointmentDetail?.salonInformation?.name}
                  />
                  {routeRoad.length > 0 && (
                    <Polyline
                      coordinates={routeRoad}
                      strokeWidth={5}
                      strokeColor={COLORS.primary}
                    />
                  )}
                </MapView>
              )}
            <TouchableOpacity
              onPress={() => setModalVisible2(false)}
              style={styles.buttonCloseMapContainer}
            >
              <Text style={styles.buttonCloseMap}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ReportAppointmentModal
        isVisible={modalVisible3}
        onClose={toggleModal3}
        data={{
          Salonid: appointmentDetail?.salonInformation?.id,
          Customerid: user.id,
          Appointmentid: appointmentDetail?.id,
          RoleNameReport: "Customer",
        }}
      />
      <CancelAppointmentModal
        isVisible={modalVisible1}
        onClose={() => {
          setModalVisible1(!modalVisible1);
        }}
        OnCancel={OnCancel}
      />
      <FeedbackAppointmentModal
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(!modalVisible);
        }}
        data={{
          SalonId: appointmentDetail?.salonInformation?.id,
          CustomerId: user.id,
          AppointmentId: appointmentDetail?.id,
        }}
      />
    </SafeAreaView>
  );
};

export default DetailAppointmennt;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  containerinfo: {
    marginTop: 60,
  },
  contentContainer: {
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  upperRow: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    width: SIZES.width - 10,
    top: SIZES.large,
    zIndex: 999,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontWeight: "bold",
    fontWeight: "500",
    // letterSpacing: 2,
    // paddingTop: SIZES.small,
    // marginBottom: SIZES.xSmall,
    color: COLORS.primary,
    marginRight: 10,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  sectionRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  sectionRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  column: {
    flex: 1,
    // marginRight: 10,
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary, // Change text color
  },
  content: {
    fontSize: 16,
  },
  contentHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 10,
  },
  ImageShop: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginTop: 5,
  },
  productInfo: {
    flex: 1,
    alignItems: "center",
  },
  productInfo2: {
    flex: 8,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  productDetails: {
    fontSize: 14,
  },
  checkoutBtn: {
    width: 150,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  checkOutText: {
    fontSize: SIZES.small,
    fontWeight: "500",
    letterSpacing: 1,
    color: COLORS.lightWhite,
    textTransform: "uppercase",
  },
  checkOutText1: {
    fontSize: SIZES.medium,
    fontWeight: "300",
    // letterSpacing: 1,
    color: COLORS.black,
    textTransform: "uppercase",
  },
  containerDelivery: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    maxWidth: 200,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // button: {
  //   width: "45%", // Adjust width
  //   height: 40, // Adjust height
  //   backgroundColor: COLORS.primary,
  //   borderRadius: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   margin: 5, // Add margin between buttons
  // },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: 200,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    // backgroundColor: "rgba(0,0,0,0.5)",
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
    marginBottom: 10,
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
  buttonReport: {
    // backgroundColor: COLORS.tertiary,
    textAlign: "center",
    padding: 10,
    borderRadius: 100,
    marginLeft: 5,
    fontWeight: "bold",
    borderWidth: 2,
    borderColor: COLORS.tertiary,
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
  titleService: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: SIZES.small,
    marginHorizontal: 5,
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
    fontSize: SIZES.xLarge,
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
  description2: {
    fontWeight: "bold",
    fontSize: SIZES.xLarge,
    textAlign: "left",
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    height: "40%",
    padding: 5,
    width: "90%",
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 5,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: "bold",
    color: COLORS.lightWhite,
  },
  buttonCloseMap: {
    // position: "absolute",
    // top: 0,
    // right: 10,
    backgroundColor: COLORS.primary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: "bold",
    color: COLORS.lightWhite,
  },
  buttonCloseMapContainer: {
    marginTop: SIZES.small,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    position: "absolute",
    borderRadius: SIZES.large,
    width: SIZES.width,
    zIndex: 999,
  },
  mapContainer: {
    borderRadius: 10,
    width: "100%",
  },
  distance: {},
  textDistance: {
    fontSize: SIZES.small,
    fontWeight: "bold",
    marginHorizontal: SIZES.xSmall,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  feedback: {
    marginBottom: 10,
    padding: 10,
    // borderWidth: 1,
    // borderColor: "#ccc",
    // borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  totalFeedbackText: {
    fontSize: SIZES.small,
    fontWeight: "bold",
  },
  feedbackText: {
    fontSize: 14,
    color: "#666",
  },
  author: {
    fontSize: SIZES.small,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 3,
  },
  date: {
    fontSize: SIZES.xSmall,
    color: "#666",
    marginBottom: 5,
  },
  reviewContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 40,
    overflow: "hidden",
    marginRight: SIZES.small,
  },
  imageContainerService: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 10,
  },
  imageWrapperService: {
    position: "relative",
    marginRight: 10,
  },
  imageService: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
