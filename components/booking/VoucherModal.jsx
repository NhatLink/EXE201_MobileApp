import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addService, addVoucher } from "../../store/bookingStore/action";
const VoucherModal = ({ isVisible, onClose }) => {
  const dispatch = useDispatch();
  const { voucherBySalonId } = useSelector((state) => state.VOUCHER);
  //   console.log("voucherBySalonId", voucherBySalonId);
  const handleBook = (item) => {
    dispatch(addVoucher(item));
    console.log("item", item);
    onClose();
  };
  //   const [uniqueServices, setUniqueServices] = useState([]);

  //   useEffect(() => {
  //     const checkedIds = new Set(services.map((service) => service.id));
  //     const filteredServices = salonService.filter(
  //       (service) => !checkedIds.has(service.id)
  //     );
  //     setUniqueServices(filteredServices);
  //   }, [salonService, services]);
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ScrollView>
        <View style={styles.fullScreenModal}>
          <Text style={styles.modalTextTitle}>Thêm voucher</Text>
          <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
            {/* <Text style={styles.textStyle}>Close</Text> */}
            <Ionicons
              style={styles.textStyle}
              name="return-up-back"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          {voucherBySalonId && voucherBySalonId.length > 0 ? (
            voucherBySalonId.map((item) => (
              <View
                key={item?.id}
                style={styles.serviceItem}
                onPress={() => {
                  // Handle navigation or other actions
                }}
              >
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
                <View style={styles.pricingInfo}>
                  <Text style={styles.serviceName} numberOfLines={1}>
                    {item?.code} {`(Giảm ${item?.discountPercentage * 100}%)`}
                  </Text>
                  <Text style={styles.serviceDescription} numberOfLines={1}>
                    {item?.description}
                  </Text>
                  {/* <Text
                    style={styles.servicePrice}
                    numberOfLines={1}
                  >{`Giảm giá ${item?.discountPercentage * 100}%`}</Text> */}
                  <Text
                    style={styles.serviceDescription}
                    numberOfLines={1}
                  >{`Ngày hết hạn: ${item?.expiryDate.split("T")[0]} `}</Text>
                  {item?.isSystemCreated ? (
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
                  onPress={() => handleBook(item)}
                >
                  <Text style={styles.button}>Chọn</Text>
                </TouchableOpacity>
              </View>
            ))
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
              <Text style={styles.text}>Không còn dịch vụ nào nữa !!!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenModal: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    // backgroundColor: COLORS.lightWhite,
    color: COLORS.lightWhite,
    paddingHorizontal: 20,
  },
  modalTextTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10,
    fontSize: SIZES.medium,
  },
  buttonClose: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingLeft: 10,
  },
  textStyle: {
    color: COLORS.black,
    fontWeight: "bold",
    textAlign: "center",
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
    flex: 6, // 2 parts
    flexDirection: "column",
    alignItems: "flex-start", // Align text to right if needed
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

export default VoucherModal;
