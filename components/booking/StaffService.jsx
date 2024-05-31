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
  Image,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { updateServiceStaff } from "../../store/bookingStore/action";
const StaffService = ({ isVisible, onClose, Service }) => {
  console.log("serviceID", Service);
  const staff = [
    {
      staffId: 1,
      name: "Tommy",
      avatar:
        "https://heygoldie.com/blog/wp-content/uploads/2021/12/barbershop-terminology-1.jpg",
      status: "sẵn sàng phục vụ",
      waitingTime: null,
    },
    {
      staffId: 2,
      name: "Trevo",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0grCc2UdcunnsGJEjy-9KwnKJ81e8Ebjrsw&s",
      status: "chưa thể phục vụ",
      waitingTime: "11h45",
    },
    {
      staffId: 3,
      name: "David",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg9-Fxb2MB8EyeMRvMyJzzr1c_V3F8Rkc8KbPmIXZaZMN83VVJsxIws1iLXmfq91f-Hg4&usqp=CAU",
      status: "không làm việc hôm nay",
      waitingTime: null,
    },
    {
      staffId: 4,
      name: "Harry",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlGIDkTqNc3EE1f7jQp6AYONkVzNRYQbn_fHT5jd8eVFZoRa5Xaz5_ZcRjgbbEbqmLwr8&usqp=CAU",
      status: "chưa thể phục vụ",
      waitingTime: "15h",
    },
  ];

  const dispatch = useDispatch();
  const handleBook = (item) => {
    dispatch(updateServiceStaff(Service, item));
    console.log("item", item);
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
          <Text style={styles.modalTextTitle}>Thay đổi nhân viên</Text>
          <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
            {/* <Text style={styles.textStyle}>Close</Text> */}
            <Ionicons
              style={styles.textStyle}
              name="return-up-back"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          {staff?.map((item) => (
            <View
              key={item.staffId}
              style={styles.serviceItem}
              onPress={() => {
                // Handle navigation or other actions
              }}
            >
              <View style={styles.serviceInfo}>
                <View style={styles.containerInfo}>
                  <Image
                    source={{
                      uri: item?.avatar,
                    }}
                    resizeMode="cover"
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.title}>{item?.name}</Text>
                    {item.status === "sẵn sàng phục vụ" ? (
                      <Text style={styles.title2} numberOfLines={1}>
                        {item.status}
                      </Text>
                    ) : (
                      <Text style={styles.title3} numberOfLines={1}>
                        {item.status}
                        {item.status === "chưa thể phục vụ" &&
                          ` cho tới ${item.waitingTime}`}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              {/* <View style={styles.pricingInfo}>
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
              </View> */}
              {(item.status === "sẵn sàng phục vụ" ||
                item.status === "chưa thể phục vụ") && (
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBook(item)}
                >
                  <Text style={styles.button} numberOfLines={1}>
                    Đổi nhân viên
                  </Text>
                </TouchableOpacity>
              )}
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
    flex: 3, // 1 part
  },
  button: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 5,
    fontSize: 13,
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
  containerInfo: {
    justifyContent: "flex-start",
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
  title2: {
    textAlign: "left",
    fontSize: SIZES.small,
    marginHorizontal: 5,
    color: "#00C135",
  },
  title3: {
    textAlign: "left",
    fontSize: SIZES.small,
    marginHorizontal: 5,
    color: COLORS.red,
  },
});

export default StaffService;
