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
  const [filteredData, setFilteredData] = useState("SUCCESSED");
  const [selectedStatus, setSelectedStatus] = useState("Thành công");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const { user } = useSelector((state) => state.USER);

  useEffect(() => {
    async function fetchData() {
      if (user && user?.id) {
        dispatch(
          GetAppointmentByHistoryCustomerId(
            currentPage,
            itemsPerPage,
            user?.id,
            filteredData
          )
        );
      }
      // console.log("accountId", userInfo);
    }
    fetchData();
  }, [user, currentPage, itemsPerPage, filteredData]);

  // useEffect(() => {
  //   setFilteredData(historyAppointment.items);
  // }, [historyAppointment]);
  const Decrease = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const Increase = () => {
    if (currentPage < historyAppointment?.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const filterOrder = (status) => {
    console.log(status);

    if (historyAppointment && historyAppointment.items) {
      setSelectedStatus(status);
      if (status === null) {
        setFilteredData("");
      } else if (status === "Thành công") {
        setFilteredData("SUCCESSED");
      } else if (status === "Thất bại") {
        setFilteredData("FAILED");
      } else if (status === "Hủy bởi khách hàng") {
        setFilteredData("CANCEL_BY_CUSTOMER");
      }
      // else {
      //   setFilteredData(
      //     data.filter(
      //       (item) =>
      //         item?.delivery?.status?.toLowerCase() === status.toLowerCase()
      //     )
      //   );
      // }
    }
  };
  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* <TouchableOpacity
            style={styles.filterButton}
            onPress={() => filterOrder(null)}
          >
            <View style={styles.filterContent}>
              <MaterialCommunityIcons name="history" size={16} color="gray" />
              <Text style={styles.filterText}>Tất cả</Text>
            </View>
          </TouchableOpacity> */}
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
                  <MaterialCommunityIcons
                    name="history"
                    size={16}
                    color="gray"
                  />
                  <Text style={styles.filterText}>{status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* <TouchableOpacity
            style={styles.filterButton}
            onPress={() => filterOrder(null)}
          >
            <View style={styles.filterContent}>
              <MaterialCommunityIcons name="history" size={16} color="gray" />
              <Text style={styles.filterText}>Tất cả</Text>
            </View>
          </TouchableOpacity> */}
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

      {historyAppointment && historyAppointment?.items?.length === 0 ? (
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
          data={historyAppointment.items}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => <OrderTile item={item} />}
          vertical={true}
          contentContainerStyle={styles.container}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            // <View style={styles.paging}>
            //   {currentPage > 1 && (
            //     <TouchableOpacity style={styles.pagingArrow} onPress={Decrease}>
            //       <Ionicons
            //         name="arrow-back-circle-outline"
            //         size={24}
            //         color={COLORS.primary}
            //       />
            //     </TouchableOpacity>
            //   )}
            //   <Text style={styles.pagingArrow}>{historyAppointment?.page}</Text>
            //   {currentPage < historyAppointment?.totalPages && (
            //     <TouchableOpacity style={styles.pagingArrow} onPress={Increase}>
            //       <Ionicons
            //         name="arrow-forward-circle-outline"
            //         size={24}
            //         color={COLORS.primary}
            //       />
            //     </TouchableOpacity>
            //   )}
            // </View>

            historyAppointment?.total > historyAppointment?.size && (
              <TouchableOpacity
                onPress={() => setItemsPerPage(itemsPerPage + 4)}
              >
                <Text style={styles.loadmoreButton}>Hiện thị thêm</Text>
              </TouchableOpacity>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    // paddingBottom: 32,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.background,
  },

  filterButton: {
    padding: 10,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: COLORS.cardcolor,
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
    backgroundColor: COLORS.cardcolor,
    textAlign: "center",
    padding: 3,
    marginVertical: 20,
    marginHorizontal: 40,
    borderRadius: 10,
    fontWeight: "bold",
  },
});

export default OrdersList;
