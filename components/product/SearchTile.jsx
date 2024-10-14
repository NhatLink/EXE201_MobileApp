import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, SHADOWS } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  addService,
  setStoreId,
  resetBooking,
} from "../../store/bookingStore/action";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";
import { resetAvailable } from "../../store/booking/action";
import { fetchServiceHairBySalonInformationId } from "../../store/salon/action";
const SearchTile = ({ item }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.USER);
  // Số dịch vụ muốn hiển thị mặc định
  const defaultLimit = 3;
  const servicesToShow = showAll
    ? item?.services
    : item?.services?.slice(0, defaultLimit);
  // const handleBook = async (storeId, item) => {
  //   try {
  //     const accessToken = await SecureStore.getItemAsync("accessToken");
  //     if (accessToken) {
  //       await dispatch(resetBooking());
  //       await dispatch(resetAvailable());
  //       await dispatch(setStoreId(storeId));
  //       await dispatch(addService(item));
  //       await dispatch(fetchServiceHairBySalonInformationId(storeId, 1, 5));
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
    console.log(storeId);

    if (isAuthenticated) {
      // Người dùng đã đăng nhập
      await dispatch(resetBooking());
      await dispatch(resetAvailable());
      await dispatch(setStoreId(storeId));
      await dispatch(addService(item));
      await dispatch(fetchServiceHairBySalonInformationId(storeId, 1, 5));
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

  return (
    // <View>
    //   <TouchableOpacity
    //     onPress={() => navigation.navigate("Details", { product: item._id })}
    //     style={styles.container}
    //   >
    //     <View style={styles.imageContainer}>
    //       <Image
    //         source={{ uri: item.image[0] }}
    //         resizeMode="cover"
    //         style={styles.productImg}
    //       />
    //     </View>
    //     <View style={styles.textContainer}>
    //       <Text style={styles.productTxt} numberOfLines={1}>
    //         {item?.productName}
    //       </Text>
    //       <Text style={styles.supplierTxt} numberOfLines={1}>
    //         {item?.description}
    //       </Text>
    //       <Text style={styles.supplierTxt} numberOfLines={1}>
    //         ${item?.price}
    //       </Text>
    //     </View>
    //   </TouchableOpacity>
    // </View>
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Details", { product: item?.id })}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item?.img }} style={styles.image} />
          <View style={styles.ratingContainer}>
            {/* <StarRating rating={item?.avgRating} /> */}
            <Text style={styles.averageRatingText}>
              {item?.rate > 0
                ? (item?.rate).toFixed(1) + "/5.0"
                : "Không có đánh giá"}
            </Text>
            <Text style={styles.averageRatingText}>
              {item?.totalReviewer
                ? item?.totalReviewer + " đánh giá"
                : "(0 đánh giá)"}
            </Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {item?.name}
          </Text>
          <Text style={styles.supplier} numberOfLines={2}>
            {item?.description}
          </Text>
          <Text style={styles.supplier} numberOfLines={2}>
            {item?.address}
          </Text>
          {item?.distance && (
            <Text style={styles.serviceName} numberOfLines={2}>
              Khoảng cách: {item?.distance.toFixed(1)} Km
            </Text>
          )}
          {item?.operatingStatus === "Đã qua thời gian làm việc" ? (
            <Text style={styles.price} numberOfLines={1}>
              {item?.operatingStatus}
            </Text>
          ) : (
            <Text style={styles.price2} numberOfLines={1}>
              {item?.operatingStatus}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      {servicesToShow?.map((itemService) => (
        <View key={itemService?.id} style={styles.serviceItem}>
          <TouchableOpacity style={styles.serviceInfo}>
            <Text style={styles.serviceName} numberOfLines={1}>
              {itemService?.serviceName}
            </Text>
            <Text style={styles.serviceDescription} numberOfLines={1}>
              {itemService?.description}
            </Text>
          </TouchableOpacity>
          <View style={styles.pricingInfo}>
            {itemService?.reducePrice ? (
              <>
                <Text style={styles.servicePrice} numberOfLines={1}>
                  {`${itemService?.reducePrice?.toLocaleString()} VND`}
                </Text>
                <Text style={styles.servicePrice2} numberOfLines={1}>
                  {`${itemService?.price.toLocaleString()} VND`}
                </Text>
              </>
            ) : (
              <Text style={styles.servicePrice} numberOfLines={1}>
                {`${itemService?.price.toLocaleString()} VND`}
              </Text>
            )}
            <Text style={styles.serviceDescription} numberOfLines={1}>
              {`${(itemService?.time ?? 0) * 60} phút`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => handleBook(item?.id, itemService)}
          >
            <Text style={styles.button}>Đặt</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Nút "Xem thêm" hoặc "Thu gọn" */}
      {item?.services?.length > defaultLimit && (
        <TouchableOpacity onPress={() => setShowAll(!showAll)}>
          <Text style={styles.loadmoreButton}>
            {showAll ? "Thu gọn" : "Xem thêm dịch vụ..."}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchTile;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 10,
  //   flexDirection: "row",
  //   padding: SIZES.medium,
  //   borderRadius: SIZES.small,
  //   backgroundColor: "#FFF",
  //   ...SHADOWS.medium,
  //   shadowColor: COLORS.white,
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
  //   height: "35%",
  //   backgroundColor: COLORS.primary,
  //   borderRadius: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // orderRow: {
  //   padding: 10,
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
  container: {
    width: "auto",
    height: "auto",
    // marginBottom: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  imageContainer: {
    flex: 1,
    width: "auto",
    height: 200,
    marginHorizontal: SIZES.medium / 2,
    marginTop: SIZES.medium / 2,
    borderRadius: SIZES.small,
    overflow: "hidden",
    justifyContent: "center",
  },
  image: {
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: SIZES.small,
  },
  detailsContainer: {
    padding: SIZES.small,
  },
  name: {
    fontSize: SIZES.large,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 1,
  },
  supplier: {
    fontFamily: "regular",
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
  },
  price: {
    fontSize: SIZES.small,
    fontWeight: "bold",
    // color: COLORS.black,
    color: COLORS.red,
    borderRadius: 5,
    overflow: "hidden",
    // paddingLeft: 5,
    maxWidth: 220,
  },
  price2: {
    fontSize: SIZES.small,
    fontWeight: "bold",
    // color: COLORS.black,
    color: COLORS.green,
    borderRadius: 5,
    overflow: "hidden",
    // paddingLeft: 5,
    maxWidth: 220,
  },
  addButton: {
    position: "absolute",
    bottom: SIZES.xSmall,
    right: SIZES.xSmall,
  },
  ratingContainer: {
    flexDirection: "column",
    backgroundColor: COLORS.banner,
    position: "absolute",
    top: 0,
    right: 0,
    borderTopEndRadius: 10,
    borderBottomStartRadius: 10,
    padding: 5,
  },
  averageRatingText: {
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    fontSize: SIZES.small,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: SIZES.xSmall,
  },
  serviceInfo: {
    flex: 6, // 7 parts
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
  loadmoreButton: {
    color: COLORS.secondary,
    textAlign: "center",
    padding: 3,
    marginVertical: 20,
    marginHorizontal: 40,
    borderRadius: 10,
    fontWeight: "bold",
    paddingHorizontal: 5,
  },
});
