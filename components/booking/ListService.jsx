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
import { COLORS, SHADOWS, SIZES, images } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { removeService } from "../../store/bookingStore/action";
import { useDispatch, useSelector } from "react-redux";
import StaffService from "./StaffService";
const ListService = ({ services }) => {
  const dispatch = useDispatch();
  const handleDelete = (id) => {
    dispatch(removeService(id));
  };
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };
  return (
    <>
      {services.map((item) => (
        <View
          key={item.service_id}
          style={[services.length > 1 && styles.subcontainer]}
        >
          <View style={styles.container}>
            <View style={styles.serviceConatainer}>
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
                  >{`${item.serviceTime} phut`}</Text>
                </View>
              </View>
            </View>
            <View style={styles.staffContaner}>
              <View style={styles.containerInfo}>
                <Image
                  source={{
                    uri: item?.staff?.avatar,
                  }}
                  resizeMode="cover"
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.title}>{item?.staff?.name}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => openModal()}
              >
                <Text style={styles.button}>Đổi nhân viên</Text>
              </TouchableOpacity>
            </View>
          </View>
          {services.length > 1 && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleDelete(item.service_id)}
            >
              <Ionicons name="close-circle" size={30} color={COLORS.black} />
            </TouchableOpacity>
          )}
          <StaffService
            isVisible={modalVisible}
            onClose={closeModal}
            Service={item.service_id}
          />
        </View>
      ))}
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
    flex: 6, // 7 parts
    flexDirection: "column",
  },
  pricingInfo: {
    flex: 2, // 2 parts
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
