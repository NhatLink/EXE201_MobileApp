import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TextInput,
  ScrollView,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { updateServiceStaff } from "../../store/bookingStore/action";
const ListServiceModal = ({ isVisible, onClose, Service }) => {
  const staff = [];

  const dispatch = useDispatch();
  const handleBook = (item) => {
    // dispatch(updateServiceStaff(item));
    // console.log("item", item);
    onClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ScrollView>
        <View style={styles.fullScreenModal}>
          <Text style={styles.modalTextTitle}>Thêm dịch vụ</Text>
          <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
            {/* <Text style={styles.textStyle}>Close</Text> */}
            <Ionicons
              style={styles.textStyle}
              name="return-up-back"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          {staff.map((item) => (
            <View
              key={item.service_id}
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
                    >{`${item.price.toLocaleString()} VND`}</Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={styles.servicePrice}
                      numberOfLines={1}
                    >{`${item.price.toLocaleString()} VND`}</Text>
                  </>
                )}

                <Text
                  style={styles.serviceDescription}
                  numberOfLines={1}
                >{`${item.serviceTime} phút`}</Text>
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBook(item)}
              >
                <Text style={styles.button}>Book</Text>
              </TouchableOpacity>
            </View>
          ))}
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
    backgroundColor: COLORS.lightWhite,
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
});

export default ListServiceModal;
