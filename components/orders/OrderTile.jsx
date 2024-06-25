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
const OrderTile = ({ item }) => {
  const [responseData, setResponseData] = useState(null);
  const [contentFeedback, setContentFeedback] = useState("");
  const [ratingFeedback, setRatingFeedback] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data, isLoading, error, refetch } = fetchOrders();
  const navigation = useNavigation();
  const AddFeedback = async () => {};

  return (
    // <View>
    //   <TouchableOpacity
    //     onPress={() =>
    //       navigation.navigate("Details-Order", {
    //         order: item?.order?._id,
    //       })
    //     }
    //     style={styles.container}
    //   >
    //     <View style={styles.containerProduct}>
    //       <View style={styles.imageContainer}>
    //         <Image
    //           source={{ uri: item?.order?.product_id?.image[0] }}
    //           resizeMode="cover"
    //           style={styles.productImg}
    //         />
    //       </View>
    //       <View style={styles.textContainer}>
    //         <Text style={styles.productTxt} numberOfLines={1}>
    //           {item?.order?.product_id?.productName}
    //         </Text>
    //         <Text style={styles.supplierTxt} numberOfLines={1}>
    //           Quantity: {item?.order?.quantity}
    //         </Text>
    //         <Text style={styles.supplierTxt} numberOfLines={1}>
    //           Total Price: {item?.order?.totalPrice}
    //         </Text>
    //         <Text style={styles.supplierTxt} numberOfLines={1}>
    //           Create date:{" "}
    //           {item?.order?.timestamp
    //             ? formatDate(item.order.timestamp)
    //             : "Không có dữ liệu thời gian"}
    //         </Text>
    //       </View>
    //     </View>
    //     {item?.shipper?.shipperName &&
    //     item?.shipper?.phone &&
    //     item?.delivery?.status ? (
    //       <View style={styles.containerDelivery}>
    //         <View style={styles.checkoutBtn}>
    //           <Text style={styles.checkOutText}>{item?.delivery?.status}</Text>
    //         </View>

    //         <View style={styles.orderRow}>
    //           <MaterialCommunityIcons
    //             name="truck-fast-outline"
    //             size={16}
    //             color="gray"
    //           />
    //           <Text style={styles.totalText}>
    //             {item?.shipper?.shipperName} - {item?.shipper?.phone}{" "}
    //           </Text>
    //         </View>
    //       </View>
    //     ) : (
    //       <View style={styles.containerDelivery}>
    //         <View style={styles.checkoutBtnChoXacNhan}>
    //           <Text style={styles.checkOutText}>Chờ xác nhận</Text>
    //         </View>
    //       </View>
    //     )}

    //     {item?.delivery?.status === "Chờ đánh giá" ? (
    //       <TouchableOpacity
    //         style={styles.containerDelivery}
    //         onPress={() => setModalVisible(true)}
    //       >
    //         <View style={styles.checkoutBtnFeedback}>
    //           <Text style={styles.checkOutText}>Feedback</Text>
    //         </View>
    //       </TouchableOpacity>
    //     ) : null}
    //   </TouchableOpacity>
    //   <Modal
    //     animationType="slide"
    //     transparent={true}
    //     visible={modalVisible}
    //     onRequestClose={() => {
    //       Alert.alert("Modal has been closed.");
    //       setModalVisible(!modalVisible);
    //     }}
    //   >
    //     <View style={styles.centeredView}>
    //       <View style={styles.modalView}>
    //         <TextInput
    //           style={styles.input}
    //           onChangeText={setContentFeedback}
    //           value={contentFeedback}
    //           placeholder="Enter your feedback"
    //         />
    //         <Rating
    //           ratingCount={5}
    //           imageSize={40}
    //           onFinishRating={setRatingFeedback}
    //         />
    //         <View style={styles.buttonRow}>
    //           <TouchableOpacity style={styles.button} onPress={AddFeedback}>
    //             <Text style={styles.textStyle}>Confirm</Text>
    //           </TouchableOpacity>
    //           <TouchableOpacity
    //             style={styles.button}
    //             onPress={() => setModalVisible(false)}
    //           >
    //             <Text style={styles.textStyle}>Cancel</Text>
    //           </TouchableOpacity>
    //         </View>
    //       </View>
    //     </View>
    //   </Modal>
    // </View>
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
              onPress={() =>
                // setModalVisible(true)
                navigation.navigate("DetailAppointment", {
                  appointmentId: item?.id,
                })
              }
            >
              <Text style={styles.button}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
          {item?.appointmentDetails?.map((itemDetail) => (
            <View key={itemDetail?.id} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName} numberOfLines={1}>
                  {itemDetail?.serviceHair?.serviceName}{" "}
                  {`(${itemDetail?.serviceHair?.time * 60} Phút)`}
                </Text>
                <Text style={styles.serviceDescription} numberOfLines={1}>{`${
                  itemDetail?.startTime?.split("T")[1]
                } đến ${itemDetail?.endTime?.split("T")[1]} `}</Text>
              </View>
              <View style={styles.pricingInfo}>
                <Text
                  style={styles.servicePrice}
                  numberOfLines={1}
                >{`${itemDetail?.serviceHair?.price?.toLocaleString()} VND`}</Text>
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
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default OrderTile;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: "space-between",
  //   alignItems: "flex-start",
  //   flexDirection: "column",
  //   padding: SIZES.medium,
  //   borderRadius: SIZES.small,
  //   backgroundColor: "#FFF",
  //   ...SHADOWS.medium,
  //   shadowColor: COLORS.white,
  // },
  // containerProduct: {
  //   flex: 1,
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   flexDirection: "row",
  // },
  // containerDelivery: {
  //   flex: 1,
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   flexDirection: "row",
  //   maxWidth: 200,
  // },
  // imageContainer: {
  //   width: 70,
  //   backgroundColor: COLORS.secondary,
  //   borderRadius: SIZES.medium,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // productImg: {
  //   width: "100%",
  //   height: 65,
  //   borderRadius: SIZES.small,
  // },
  // textContainer: {
  //   flex: 1,
  //   marginHorizontal: SIZES.medium,
  // },
  // productTxt: {
  //   fontSize: SIZES.medium,
  //   fontFamily: "bold",
  //   color: COLORS.primary,
  // },
  // supplierTxt: {
  //   fontSize: SIZES.small + 2,
  //   fontFamily: "regular",
  //   color: COLORS.gray,
  //   marginTop: 3,
  //   textTransform: "capitalize",
  // },
  // checkOutText: {
  //   paddingHorizontal: 10,
  //   fontSize: SIZES.small,
  //   fontWeight: "500",
  //   letterSpacing: 1,
  //   color: COLORS.lightWhite,
  //   textTransform: "uppercase",
  // },
  // checkoutBtn: {
  //   width: "100%",
  //   height: "100%",
  //   backgroundColor: COLORS.primary,
  //   borderRadius: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   maxWidth: 140,
  //   maxHeight: 20,
  // },
  // checkoutBtnChoXacNhan: {
  //   width: "100%",
  //   height: "100%",
  //   backgroundColor: COLORS.primary,
  //   borderRadius: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   // maxWidth: 250,
  //   // maxHeight: 30,
  // },
  // checkoutBtnFeedback: {
  //   width: "150%",
  //   height: "100%",
  //   backgroundColor: COLORS.primary,
  //   borderRadius: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: 10,
  // },
  // orderRow: {
  //   paddingLeft: 10,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  // },
  // totalText: {
  //   fontFamily: "medium",
  //   fontSize: SIZES.small,
  //   color: COLORS.gray,
  //   textTransform: "uppercase",
  // },
  // centeredView: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: 22,
  // },
  // modalView: {
  //   margin: 20,
  //   backgroundColor: "white",
  //   borderRadius: 20,
  //   padding: 35,
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
  // button: {
  //   width: "100%",
  //   height: "100%",
  //   backgroundColor: COLORS.primary,
  //   borderRadius: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   maxWidth: 120,
  //   maxHeight: 20,
  // },
  // buttonRow: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   width: "100%",
  // },
  // textStyle: {
  //   color: "white",
  //   fontWeight: "bold",
  //   textAlign: "center",
  // },
  // input: {
  //   width: 200,
  //   height: 40,
  //   margin: 12,
  //   borderWidth: 1,
  //   padding: 10,
  // },
  container: {
    backgroundColor: "#FFF",
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
