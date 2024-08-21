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
import formatDate from "../../utils/helper";
import OrderTile from "../../components/orders/OrderTile";
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons, Feather } from "@expo/vector-icons";
import ModalDetailHistoryReport from "./ModalDetailHistoryReport";
const ListHistory = ({ item }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [favorites, setFavorites] = useState(false);
  // console.log("item schedule: ", item);
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
  return (
    <View style={styles.container}>
      <View style={styles.containerDate}>
        <View style={styles.line1} />
        <Text style={styles.text}>
          {item?.createDate?.split("T")[0]} /{" "}
          {item?.createDate?.split("T")[1].split(".")[0]}
        </Text>
        <View style={styles.line} />
      </View>
      <View>
        <Text style={styles.description2}>Salon / barber bị báo cáo: </Text>
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
              navigation.navigate("Details", {
                product: item?.salonInformation?.id,
              })
            }
          >
            <Text style={styles.description}>
              {item?.salonInformation?.name}
            </Text>
            <Text style={styles.descriptionText}>
              {item?.salonInformation?.address}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.descriptionWrapper2}>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description2}>Lý do:</Text>

            <Text style={styles.descriptionPrice} numberOfLines={1}>
              {item?.reasonReport}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.descriptionWrapper}
            onPress={() => {}}
          >
            <Text style={styles.descriptionText2}>Trạng thái đơn:</Text>
            <Text style={styles.descriptionTextTime}>
              {getStatusText(item?.status)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.descriptionWrapper2}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.button}>Chi tiết Báo Cáo</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ModalDetailHistoryReport
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={item}
      />
    </View>
  );
};

export default ListHistory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardcolor,
    ...SHADOWS.medium,
    position: "relative",
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    borderWidth: 0.5,
    borderColor: COLORS.black,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  Storedescription: {
    flex: 3,
    justifyContent: "center",
    alignItems: "flex-start",
    // paddingLeft: SIZES.small,
  },
  bookButton: {
    width: "auto",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  priceTime: {
    flex: 8,
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
  description: {
    fontFamily: "bold",
    fontSize: SIZES.large - 2,
  },
  descriptionWrapper: {
    // marginTop: SIZES.medium,
    // marginHorizontal: SIZES.large,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderBottomWidth: 0.5,
    // borderBottomColor: COLORS.black,
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
    marginRight: 5,
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
    marginTop: 5,
    // marginHorizontal: SIZES.large,
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.black,
  },
  descriptionText2: {
    // fontFamily: "regular",
    fontSize: SIZES.small,
    textAlign: "center",
    // marginBottom: SIZES.small,
  },
  descriptionPrice: {
    fontWeight: "bold",
    textAlign: "right",
    fontSize: SIZES.large - 2,
  },
  descriptionTextTime: {
    // fontFamily: "regular",
    fontSize: SIZES.small,
    // textAlign: "right",
    // marginBottom: SIZES.small,
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
});
