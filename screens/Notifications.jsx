import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES } from "../constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CartList } from "../components";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Cập nhật dịch vụ",
      subTitle: "Dịch vụ của bạn đã được cập nhật.",
      read: false,
    },
    {
      id: "2",
      title: "Khuyến mãi đặc biệt",
      subTitle: "Nhận ngay ưu đãi 50% cho dịch vụ mới.",
      read: true,
    },
    {
      id: "3",
      title: "Lịch hẹn sắp tới",
      subTitle: "Bạn có lịch hẹn vào ngày mai lúc 10:00 AM.",
      read: false,
    },
    {
      id: "4",
      title: "Cập nhật chính sách",
      subTitle: "Chính sách bảo mật của chúng tôi đã thay đổi.",
      read: true,
    },
  ]);

  // Hàm xử lý khi nhấn vào một thông báo
  const handlePressNotification = (id) => {
    // Thay đổi trạng thái của thông báo thành "đã đọc"
    setNotifications((prevState) =>
      prevState.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handlePressNotification(item.id)}
    >
      <View style={styles.notificationText}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationSubTitle}>{item.subTitle}</Text>
      </View>
    </TouchableOpacity>
  );
  const filterReport = async (status) => {
    setSelectedStatus(status);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}> Thông báo </Text>
      </View>
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["Tất cả", "Chưa đọc"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                selectedStatus === status && styles.selectedFilterButton,
              ]}
              onPress={() => filterReport(status)}
            >
              <View style={styles.filterContent}>
                <MaterialCommunityIcons
                  name="alert-decagram"
                  size={16}
                  color="gray"
                />
                <Text style={styles.filterText}>{status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationList}
      />
    </SafeAreaView>
  );
};
export default Notifications;
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
    fontWeight: "bold",
    // letterSpacing: 2,
    paddingTop: SIZES.xSmall,
    // paddingLeft: SIZES.xLarge,
    marginBottom: SIZES.xSmall,
  },
  notificationList: {
    padding: 10,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: COLORS.cardcolor,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  notificationSubTitle: {
    fontSize: 14,
    color: COLORS.black,
  },
  notificationUnread: {
    backgroundColor: COLORS.lightGray,
  },
  notificationRead: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderWidth: 1,
  },
  filtersContainer: {
    flexDirection: "row",
    // paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.background,
  },

  filterButton: {
    padding: 10,
    marginRight: 5,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    backgroundColor: COLORS.cardcolor,
  },

  selectedFilterButton: {
    borderColor: COLORS.cardcolor,
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
  },
  filterContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  filterText: {
    marginLeft: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
});
