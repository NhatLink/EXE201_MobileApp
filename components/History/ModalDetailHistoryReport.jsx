import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import ButtonCustom from "../auth/Button";
import { COLORS, SIZES } from "../../constants";
import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  AntDesign,
  Ionicons,
} from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";
import { CreateReport } from "../../store/report/action";

const ModalDetailHistoryReport = ({ isVisible, onClose, data }) => {
  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang xử lý";
      case "APPROVED":
        return "Chấp thuận";
      case "REJECTED":
        return "Thất bại";
      default:
        return "Từ chối";
    }
  };
  const getStatusText2 = (status) => {
    switch (status) {
      case "BOOKING":
        return "Đang xử lý";
      case "CANCEL_BY_CUSTOMER":
        return "Hủy bởi khách hàng";
      case "FAILED":
        return "Thất bại";
      case "SUCCESSED":
        return "Thành công";
      default:
        return "Từ chối";
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ScrollView style={styles.fullScreenModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chi tiết báo cáo</Text>
          <View style={styles.line} />
          <Text style={styles.modalText}>Trạng thái bài báo cáo</Text>
          <Text style={styles.modalSubText}>{getStatusText(data?.status)}</Text>
          <View style={styles.line} />
          <Text style={styles.modalText}>Lý do báo cáo</Text>
          <Text style={styles.modalSubText}>{data?.reasonReport}</Text>
          <View style={styles.line} />
          <Text style={styles.modalText}>{`Ảnh báo cáo`} </Text>
          <View horizontal style={styles.imageContainerReport}>
            {data?.fileReports?.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image.img }} style={styles.image} />
              </View>
            ))}
          </View>
          <View style={styles.line} />
          <Text style={styles.modalText}>{`Chi tiết lịch hẹn`} </Text>
          <Text style={styles.modalSubText}>
            Trạng thái lịch hẹn: {getStatusText2(data?.appointment?.status)}
          </Text>
          <View style={styles.container}>
            <View style={styles.containerDate}>
              <View style={styles.line1} />
              <Text style={styles.text}>
                {data?.createDate?.split("T")[0]} /{" "}
                {data?.createDate.split("T")[1].split(".")[0]}
              </Text>
              <View style={styles.line1} />
            </View>
            <View>
              <View style={styles.descriptionWrapper}>
                <TouchableOpacity style={styles.imageContainer}>
                  <Image
                    source={{ uri: data?.salonInformation?.img }}
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
                    //   appointmentId: data?.id,
                    // })
                    {}
                  }
                >
                  <Text style={styles.description}>
                    {data?.salonInformation?.name}
                  </Text>
                  <Text style={styles.descriptionText}>
                    {data?.salonInformation?.description}
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() =>
                    navigation.navigate("DetailAppointment", {
                      appointmentId: data?.id,
                    })
                  }
                >
                  <Text style={styles.button}>Chi tiết</Text>
                </TouchableOpacity> */}
              </View>
              {data?.appointment?.appointmentDetails?.map((itemDetail) => (
                <View key={itemDetail?.id} style={styles.serviceItem}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName} numberOfLines={1}>
                      {itemDetail?.serviceName}{" "}
                      {`(${itemDetail?.timeServiceHair * 60} Phút)`}
                    </Text>
                    <Text
                      style={styles.serviceDescription}
                      numberOfLines={1}
                    >{`${itemDetail?.startTime?.split("T")[1]} đến ${
                      itemDetail?.endTime?.split("T")[1]
                    } `}</Text>
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
                  {data?.appointment?.discountedPrice > 0 ? (
                    <>
                      <Text
                        style={styles.descriptionPrice}
                        numberOfLines={1}
                      >{`${data?.appointment?.totalPrice?.toLocaleString()} VND`}</Text>
                      <Text
                        style={styles.servicePrice2}
                        numberOfLines={1}
                      >{`${data?.appointment?.originalPrice?.toLocaleString()} VND`}</Text>
                    </>
                  ) : (
                    <Text
                      style={styles.descriptionPrice}
                      numberOfLines={1}
                    >{`${data?.appointment?.totalPrice?.toLocaleString()} VND`}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.line} />
        </View>
        <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
          {/* <Text style={styles.textStyle}>Quay lại</Text> */}
          <Ionicons
            style={styles.textStyle}
            name="return-up-back"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenModal: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalContent: {
    flex: 1,
    justifyContent: "flex-start",
    // alignItems: "flex-start",
    backgroundColor: COLORS.background,
  },
  modalTitle: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 18,
    textAlign: "left",
    marginHorizontal: 5,
    fontWeight: "bold",
  },
  modalSubText: {
    fontSize: 18,
    textAlign: "left",
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginVertical: 20,
  },
  buttonrright: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderLeftWidth: 0.5,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonleft: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    borderWidth: 2,
    borderRightWidth: 0.5,
    borderColor: COLORS.primary,
  },
  //   button: {
  //     flexDirection: "row",
  //     justifyContent: "center",
  //     alignContent: "center",
  //     textAlign: "center",
  //     backgroundColor: COLORS.secondary,
  //     padding: 10,
  //     borderRadius: 15,
  //     borderWidth: 2,
  //     borderColor: COLORS.primary,
  //   },
  buttonText: {
    color: COLORS.black,
    fontSize: 15,
  },
  imageContainerReport: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    padding: 1,
    backgroundColor: COLORS.gray2,
    marginVertical: 10,
  },
  button: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: "bold",
  },
  container: {
    backgroundColor: COLORS.background,
    // ...SHADOWS.medium,
    position: "relative",
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    // marginHorizontal: 15,
  },
  containerDate: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
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
  buttonClose: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingLeft: 10,
  },
  textStyle: {
    color: COLORS.black,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ModalDetailHistoryReport;
