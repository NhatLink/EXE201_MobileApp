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
import React, { useState } from "react";
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
const Service = (storeId) => {
  const navigation = useNavigation();
  const { salonService, salonEmployee } = useSelector((state) => state.SALON);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [filteredServices, setFilteredServices] = useState(salonService);
  const dispatch = useDispatch();

  const handleBook = async (storeId, item) => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (accessToken) {
        dispatch(resetBooking());
        dispatch(resetAvailable());
        dispatch(setStoreId(storeId?.storeId));
        dispatch(addService(item));
        // Điều hướng hoặc logic bổ sung
        navigation.navigate("Booking");
      } else {
        throw new Error("Access token không tồn tại");
      }
    } catch (error) {
      console.log("Lỗi trong handleBook:", error);
      ToastAndroid.show(
        "Vui lòng đăng nhập để sử dụng tính năng trên",
        ToastAndroid.SHORT
      );
    }
    // dispatch(resetBooking());
    // dispatch(resetAvailable());
    // dispatch(setStoreId(storeId?.storeId));
    // dispatch(addService(item));
    // console.log("store", storeId);
    // console.log("item", item);
    // // Navigation or additional logic
    // navigation.navigate("Booking");
  };
  const getImageUrls = (images) => {
    return images.map((image) => image.src);
  };

  const openModal = (service) => {
    setSelectedService({
      ...service,
      images: getImageUrls(service.images),
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedService(null);
  };
  // const handleSearch = () => {
  //   Keyboard.dismiss();
  //   const filtered = salonService.filter((service) =>
  //     service.serviceName.toLowerCase().includes(searchKey.toLowerCase())
  //   );
  //   setFilteredServices(filtered);
  // };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* <View style={styles.searchContainer}>
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
              placeholder="Bạn đang tìm gì?"
            />
          </View>

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Ionicons
              name="search"
              size={SIZES.medium}
              color={COLORS.offwhite}
            />
          </TouchableOpacity>
        </View> */}
        {salonService.map((item) => (
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
              <Text style={styles.button}>Đặt </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false} // Set transparent to false to use the full screen
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.fullScreenModal}>
          <Text style={styles.modalTextTitle}>
            {selectedService?.serviceName}
          </Text>
          {selectedService?.images && (
            <View style={styles.carouselContainer}>
              <SliderBox
                images={selectedService?.images}
                dotColor={COLORS.primary}
                inactiveDotColor={COLORS.secondary}
                ImageComponentStyle={{
                  borderRadius: 15,
                  width: "93%",
                  marginBottom: 10,
                }}
                autoplay
                circleLoop
              />
            </View>
          )}
          <Text style={styles.modalText}>{selectedService?.description}</Text>
        </View>
        <TouchableOpacity style={styles.buttonClose} onPress={closeModal}>
          <Text style={styles.textStyle}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Service;

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
    fontSize: SIZES.xLarge,
    fontFamily: "bold",
    fontWeight: "500",
    letterSpacing: 2,
    paddingTop: SIZES.small,
    // paddingLeft: SIZES.xLarge,
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
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 35,
    backgroundColor: COLORS.lightWhite,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    marginLeft: 10,
    fontSize: SIZES.small,
  },
  modalTextTitle: {
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
    marginLeft: 10,
    fontSize: SIZES.medium,
  },
  buttonClose: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
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
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginHorizontal: SIZES.small,
    height: 30,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    marginRight: SIZES.xSmall,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.small,
    height: "100%",
  },
  searchInput: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.xSmall,
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
});
