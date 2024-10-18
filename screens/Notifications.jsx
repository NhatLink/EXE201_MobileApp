import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, SIZES } from "../constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CartList } from "../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  actGetNotificationList,
  actUpdateNotificationList,
} from "../store/notification/action";
import * as signalR from "@microsoft/signalr";
import { RefreshControl } from "react-native";

const Notifications = ({ navigation }) => {
  const dispatch = useDispatch();
  // const navigation = useNavigation();
  const notificationList = useSelector(
    (state) => state.NOTIFICATION.notificationList
  );
  // console.log("notificationList", notificationList);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const { accountId } = useSelector((state) => state.USER);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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

  // useEffect(() => {
  //   let connection;
  //   const setupSignalR = async () => {
  //     try {
  //       // Tạo kết nối SignalR
  //       connection = new signalR.HubConnectionBuilder()
  //         .withUrl("https://hairhub.gahonghac.net/book-appointment-hub")
  //         .withAutomaticReconnect()
  //         .build();

  //       // Bắt đầu kết nối
  //       await connection.start();
  //       // Lắng nghe sự kiện "ReceiveMessage"
  //       connection.on(
  //         "ReceiveNotification",
  //         async (Title, Message, list, apps, customer, CreatedDate) => {
  //           console.log("list", list);
  //           if (list.includes(accountId)) {
  //             dispatch(actGetNotificationList(accountId, page, size));
  //           } else {
  //             console.error("Không trùng khớp idOwner với ownerId");
  //           }
  //         }
  //       );
  //     } catch (error) {
  //       console.error("Lỗi khi thiết lập SignalR:", error);
  //     }
  //   };

  //   setupSignalR();

  //   // Dọn dẹp kết nối khi component bị hủy
  //   return () => {
  //     if (connection) {
  //       connection.stop().then(() => {
  //         console.log("Kết nối SignalR đã được dừng.");
  //       });
  //     }
  //   };
  // }, [accountId]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoader(true);
        if (accountId) {
          await dispatch(actGetNotificationList(accountId, page, size));
        }
      } finally {
        setLoader(false);
      }
    }
    fetchData();
  }, [accountId, page, size]);

  // Hàm xử lý khi nhấn vào một thông báo
  const handlePressNotification = async (id, appointmentId) => {
    // Thay đổi trạng thái của thông báo thành "đã đọc"
    if (id) {
      await dispatch(actUpdateNotificationList(id, accountId, page, size));
      navigation.navigate("DetailAppointment", {
        appointmentId: appointmentId,
      });
    }
  };
  const renderItem = ({ item }) => {
    const { notification, appointment } = item;
    // Kiểm tra loại thông báo và thay đổi thông điệp nếu cần
    const message =
      notification.type === "newAppointment"
        ? `Bạn đã đặt lịch ở ${notification.message.split("ở ")[1]}`
        : notification.message;
    const notificationStyle = notification.isRead
      ? styles.readNotificationItem // Kiểu thông báo đã đọc
      : styles.unreadNotificationItem; // Kiểu thông báo chưa đọc
    return (
      <TouchableOpacity
        style={[styles.notificationItem, notificationStyle]}
        onPress={() => handlePressNotification(item?.id, appointment?.id)}
      >
        <View style={styles.notificationText}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            {!notification.isRead && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.notificationSubTitle}>{message}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setSize(10);
    await dispatch(actGetNotificationList(accountId, page, 10));
    setRefreshing(false);
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
      {/* <View style={styles.filtersContainer}>
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
      </View> */}
      {notificationList?.items?.length > 0 ? (
        <FlatList
          data={notificationList?.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={() => {
            if (!loader && notificationList?.total > notificationList?.size) {
              setSize(size + 10); // Tăng kích thước khi đến cuối danh sách
            }
          }}
          onEndReachedThreshold={0.5} // Kích hoạt khi kéo gần đến cuối (50%)
          ListFooterComponent={
            <View style={styles.paging}>
              {notificationList?.total > notificationList?.size && (
                <ActivityIndicator
                  size="large"
                  color={COLORS.secondary}
                  animating={loader}
                />
              )}
            </View>
          }
        />
      ) : (
        <Text style={styles.notificationEmptyTitle}>
          Bạn chưa nhận thông báo nào !!!
        </Text>
      )}
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
  },
  unreadNotificationItem: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: COLORS.cardcolor,
  },
  readNotificationItem: {
    backgroundColor: COLORS.background,
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flex: 1,
    flexDirection: "row",
  },
  notificationEmptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.secondary,
    textAlign: "center",
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
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4, // Để tạo hình tròn
    marginLeft: 8, // Khoảng cách giữa tiêu đề và chấm đỏ
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
  paging: {
    // position: "absolute",
    // bottom: 0,
    // right: "50%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pagingArrow: {
    // marginVertical: 10,
    padding: 10,
  },
  loadmoreButton: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 3,
    marginVertical: 20,
    marginHorizontal: 40,
    borderRadius: 10,
    fontWeight: "bold",
    paddingHorizontal: 5,
  },
});
