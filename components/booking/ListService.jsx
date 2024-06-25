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
import { COLORS, SHADOWS, SIZES, images } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { removeService } from "../../store/bookingStore/action";
import { useDispatch, useSelector } from "react-redux";
import StaffService from "./StaffService";
import Loader from "../auth/Loader";
const ListService = () => {
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.booking);
  const { loading, availableTime, bookAppoinment, error } = useSelector(
    (state) => state.BOOKING
  );
  const [load, setLoad] = useState(false);
  const handleDelete = async (id) => {
    setLoad(true);
    await dispatch(removeService(id));
    if (bookAppoinment && bookAppoinment.bookingDetailResponses && services) {
      let timesArray = bookAppoinment.bookingDetailResponses.map((detail) => ({
        id: detail.serviceHair.id,
        startTime: detail.serviceHair.startTime,
        endTime: detail.serviceHair.endTime,
        waitingTime: detail.serviceHair.waitingTime,
      }));

      const combinedData = services.map((service) => ({
        ...service,
        ...timesArray.find((time) => time.id === service.id),
      }));

      settotalService(combinedData);
      // console.log("data service", combinedData);
    }
    setLoad(false);
  };
  const [totalService, settotalService] = useState(services);
  const [modalVisible, setModalVisible] = useState(false);
  const [serviceId, setserviceId] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = (item) => {
    setModalVisible(true);
    setserviceId(item);
  };
  const canPressButton = services.length > 0 && availableTime.length > 0;
  useEffect(() => {
    if (bookAppoinment && bookAppoinment.bookingDetailResponses && services) {
      let timesArray = bookAppoinment.bookingDetailResponses.map((detail) => ({
        id: detail.serviceHair.id,
        startTime: detail.serviceHair.startTime,
        endTime: detail.serviceHair.endTime,
        waitingTime: detail.serviceHair.waitingTime,
      }));

      const combinedData = services.map((service) => ({
        ...service,
        ...timesArray.find((time) => time.id === service.id),
      }));

      settotalService(combinedData);
      // console.log("data service", combinedData);
    }
  }, [bookAppoinment]);
  return (
    <>
      <Loader visible={load} />
      {totalService.map((item) => (
        <View
          key={item.id}
          style={[
            services.length > 1 &&
              availableTime.length > 0 &&
              styles.subcontainer,
          ]}
        >
          <View style={styles.container}>
            <View style={styles.serviceConatainer}>
              <View
                key={item.id}
                style={styles.serviceItem}
                onPress={() => {
                  // Handle navigation or other actions
                }}
              >
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName} numberOfLines={1}>
                    {item.serviceName}
                  </Text>
                  <Text style={styles.serviceDescription} numberOfLines={1}>
                    {item.description}
                  </Text>
                </View>
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

                  {/* <Text style={styles.serviceDescription} numberOfLines={1}>{`${
                    item.time * 60
                  } phút`}</Text> */}
                  <Text style={styles.serviceDescription} numberOfLines={2}>
                    Thời gian : {item?.startTime?.split("T")[1]} -{" "}
                    {item?.endTime?.split("T")[1]}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.staffContaner}>
              <View style={styles.containerInfo}>
                <Image
                  source={{
                    uri: item?.staff?.img,
                  }}
                  resizeMode="cover"
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.title}>{item?.staff?.fullName}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={canPressButton ? () => openModal(item.id) : null}
                activeOpacity={canPressButton ? 0.7 : 1}
              >
                <Text
                  style={canPressButton ? styles.button : styles.disabledButton}
                >
                  Đổi nhân viên
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {services.length > 1 && availableTime.length > 0 && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="close-circle" size={30} color={COLORS.black} />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <StaffService
        isVisible={modalVisible}
        onClose={closeModal}
        Service={serviceId}
      />
    </>
  );
};

export default ListService;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    ...SHADOWS.medium,
    position: "relative",
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: COLORS.black,
  },
  subcontainer: {
    paddingTop: 10,
    paddingRight: 10,
  },
  serviceConatainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    // marginVertical: 15,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    // marginVertical: 5,
    // borderRadius: 10,
    // backgroundColor: COLORS.gray2,
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
  cancelButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  bookButton: {
    flex: 2,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 5,
    borderRadius: 10,
    marginLeft: 5,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#b1b1b3",
    textAlign: "center",
    padding: 5,
    borderRadius: 10,
    marginLeft: 5,
    fontWeight: "bold",
  },
  staffContaner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  containerInfo: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  avatar: {
    height: 35,
    width: 35,
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
