import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import fetchOrders from "../../hook/fetchOrders";
import OrderTile from "./OrderTile";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { GetAppointmentByHistoryCustomerId } from "../../store/appointment/action";
const OrdersList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data, isLoading, error, refetch } = fetchOrders();
  const { historyAppointment, loading } = useSelector(
    (state) => state.APPOINTMENT
  );
  const [filteredData, setFilteredData] = useState(historyAppointment);
  const [selectedStatus, setSelectedStatus] = useState(null);
  // const [load, setLoad] = useState(false);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     refetch;
  //   }, [data])
  // );
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(100);

  // useEffect(() => {
  //   async function fetchData() {
  //     setLoad(true);
  //     const userInfoJson = await SecureStore.getItemAsync("userInfo");
  //     let userInfo = null;
  //     if (userInfoJson) {
  //       try {
  //         userInfo = JSON.parse(userInfoJson);
  //       } catch (error) {
  //         console.error("Error parsing userInfo", error);
  //       }
  //     }
  //     if (userInfo && userInfo?.id) {
  //       dispatch(
  //         GetAppointmentByHistoryCustomerId(
  //           currentPage,
  //           itemsPerPage,
  //           userInfo?.id
  //         )
  //       );
  //     }
  //     console.log("accountId", userInfo);
  //     setLoad(false);
  //   }
  //   fetchData();
  // }, []);
  // console.log("datainOrder:", filteredData);
  useEffect(() => {
    setFilteredData(historyAppointment); // Cập nhật filteredData mỗi khi data thay đổi
  }, [historyAppointment]); // Phụ thuộc vào data

  const filterOrder = (status) => {
    setSelectedStatus(status);
    if (status === null) {
      setFilteredData(historyAppointment);
    } else if (status === "Thành công") {
      setFilteredData(
        historyAppointment.filter((item) => item?.status === "SUCCESSED")
      );
    } else if (status === "Thất bại") {
      setFilteredData(
        historyAppointment.filter((item) => item?.status === "FAILED")
      );
    } else if (status === "Hủy bởi khách hàng") {
      setFilteredData(
        historyAppointment.filter(
          (item) => item?.status === "CANCEL_BY_CUSTOMER"
        )
      );
    }
    // else {
    //   setFilteredData(
    //     data.filter(
    //       (item) =>
    //         item?.delivery?.status?.toLowerCase() === status.toLowerCase()
    //     )
    //   );
    // }
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // if (data.length === 0) {
  //   return (
  //     <View style={styles.emptyContainer}>
  //       <Image
  //         source={{
  //           uri: "https://rsrc.easyeat.ai/mweb/no-orders2.webp",
  //         }} // Đường dẫn tới ảnh bạn muốn hiển thị
  //         style={styles.emptyImage}
  //       />
  //       <View style={styles.buttonContainer}>
  //         <Button
  //           title="Go to Shopping"
  //           onPress={() => navigation.navigate("Bottom Navigation")} // Thay 'Home' bằng tên màn hình chính xác trong stack navigator của bạn
  //         />
  //       </View>
  //     </View>
  //   );
  // }

  // if (filteredData.length === 0) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Image
  //         source={{ uri: "https://rsrc.easyeat.ai/mweb/no-orders2.webp" }}
  //         style={styles.emptyFilterImage}
  //       />
  //       {/* <View style={styles.buttonContainer}>
  //           <Button
  //             title="Go to Shopping"
  //             onPress={() => navigation.navigate("Bottom Navigation")}
  //           />
  //         </View> */}
  //     </View>
  //   );
  // }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => filterOrder(null)}
          >
            <View style={styles.filterContent}>
              <MaterialCommunityIcons name="history" size={16} color="gray" />
              <Text style={styles.filterText}>Tất cả</Text>
            </View>
          </TouchableOpacity>
          {["Thành công", "Thất bại", "Hủy bởi khách hàng"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                selectedStatus === status && styles.selectedFilterButton,
              ]}
              onPress={() => filterOrder(status)}
            >
              <View style={styles.filterContent}>
                <MaterialCommunityIcons name="history" size={16} color="gray" />
                <Text style={styles.filterText}>{status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredData.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("../../assets/images/error-in-calendar.png")}
            style={styles.emptyFilterImage}
          />
          {selectedStatus ? (
            <Text style={styles.emptyText}>
              {`Không có lịch hẹn ${selectedStatus} nào được tìm thấy `}
            </Text>
          ) : (
            <Text style={styles.emptyText}>
              {`Không có lịch hẹn nào được tìm thấy `}
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => <OrderTile item={item} />}
          vertical={true}
          contentContainerStyle={styles.container}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  separator: {
    // width: 16,
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // hoặc màu nền tùy chọn của bạn
  },
  emptyImage: {
    width: 300, // Chiều rộng của màn hình
    height: 300, // Chiều cao của màn hình
    resizeMode: "cover", // Điều chỉnh ảnh để vừa vặn không gian hiển thị mà không bị méo
  },
  emptyFilterImage: {
    width: 300, // Chiều rộng của màn hình
    height: 300, // Chiều cao của màn hình
    resizeMode: "cover", // Điều chỉnh ảnh để vừa vặn không gian hiển thị mà không bị méo
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  filtersContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#f0f0f0",
  },

  filterButton: {
    padding: 10,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  selectedFilterButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
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

export default OrdersList;
