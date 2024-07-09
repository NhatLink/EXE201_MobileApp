import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";
import React, { useCallback, useEffect, useState } from "react";
import { ListHistory } from "../components";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Animated,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/auth/Loader";
import * as SecureStore from "expo-secure-store";
import { GetReportByCustomerId } from "../store/report/action";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const History = () => {
  const navigation = useNavigation();
  // console.log("appoint", appointments);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [status, setStatus] = useState(null);
  const { customerReport, loading } = useSelector((state) => state.REPORT);
  const [refreshing, setRefreshing] = useState(false);
  const { user, accessToken, refreshToken, isAuthenticated } = useSelector(
    (state) => state.USER
  );
  console.log("customerReport:", customerReport);
  const fetchData = async () => {
    // const userInfoJson = await SecureStore.getItemAsync("userInfo");
    // let userInfo = null;
    // if (userInfoJson) {
    //   try {
    //     userInfo = JSON.parse(userInfoJson);
    //   } catch (error) {
    //     console.error("Error parsing userInfo", error);
    //   }
    // }
    if (user && user?.id) {
      dispatch(
        GetReportByCustomerId(user?.id, currentPage, itemsPerPage, status)
      );
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, selectedStatus]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setSelectedStatus(null), setRefreshing(false));
  }, []);
  const filterReport = async (status) => {
    setSelectedStatus(status);
    // const userInfoJson = await SecureStore.getItemAsync("userInfo");
    // let userInfo = null;
    // if (userInfoJson) {
    //   try {
    //     userInfo = JSON.parse(userInfoJson);
    //   } catch (error) {
    //     console.error("Error parsing userInfo", error);
    //   }
    // }
    if (status === null) {
      // dispatch(
      //   GetReportByCustomerId(
      //     userInfo?.id,
      //     currentPage,
      //     itemsPerPage,
      //   )
      // );
      setStatus(null);
    } else if (status === "Đang xử lý") {
      // dispatch(
      //   GetReportByCustomerId(
      //     userInfo?.id,
      //     currentPage,
      //     itemsPerPage,
      //     "PENDING"
      //   )
      // );
      setStatus("PENDING");
    } else if (status === "Chấp thuận") {
      // dispatch(
      //   GetReportByCustomerId(
      //     userInfo?.id,
      //     currentPage,
      //     itemsPerPage,
      //     "APPROVED"
      //   )
      // );
      setStatus("APPROVED");
    } else if (status === "Từ chối") {
      // dispatch(
      //   GetReportByCustomerId(
      //     userInfo?.id,
      //     currentPage,
      //     itemsPerPage,
      //     "REJECTED"
      //   )
      // );
      setStatus("REJECTED");
    }
  };
  const Decrease = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const Increase = () => {
    if (currentPage < feedback?.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          color: COLORS.lightWhite,
          marginTop: 10,
        }}
      >
        {/* <Loader visible={loading} /> */}
        <View style={styles.upperRow}>
          <TouchableOpacity
            style={{ paddingLeft: 0 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-circle"
              size={30}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.title}> Lịch sử báo cáo</Text>
        </View>
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => filterReport(null)}
            >
              <View style={styles.filterContent}>
                <MaterialCommunityIcons
                  name="alert-decagram"
                  size={16}
                  color="gray"
                />
                <Text style={styles.filterText}>Tất cả</Text>
              </View>
            </TouchableOpacity>
            {["Đang xử lý", "Chấp thuận", "Từ chối"].map((status) => (
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        color: COLORS.lightWhite,
        marginTop: 10,
      }}
    >
      {/* <Loader visible={loading} /> */}
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}> Lịch sử báo cáo</Text>
      </View>
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => filterReport(null)}
          >
            <View style={styles.filterContent}>
              <MaterialCommunityIcons
                name="alert-decagram"
                size={16}
                color="gray"
              />
              <Text style={styles.filterText}>Tất cả</Text>
            </View>
          </TouchableOpacity>
          {["Đang xử lý", "Chấp thuận", "Từ chối"].map((status) => (
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
      {customerReport &&
      customerReport?.items &&
      customerReport?.items?.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image
              source={require("../assets/images/error-in-calendar.png")}
              style={styles.searchImage}
            />
            <Text style={styles.emptyText}>
              Không có báo cáo {selectedStatus} nào được tìm thấy
            </Text>
          </View>
          {/* <View selectedStatus>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Text style={styles.button}>Tìm kiếm dịch vụ</Text>
            </TouchableOpacity>
            {!isAuthenticated && (
              <>
                <Text style={styles.emptyText2}>
                  ---------------Đã sử dụng HairHub---------------
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Text style={styles.button}>Đăng Nhập</Text>
                </TouchableOpacity>
              </>
            )}
          </View> */}
        </View>
      ) : (
        <>
          <FlatList
            data={customerReport?.items}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => <ListHistory item={item} />}
          />
          <View style={styles.paging}>
            {currentPage > 1 && (
              <TouchableOpacity style={styles.pagingArrow} onPress={Decrease}>
                <Ionicons
                  name="arrow-back-circle-outline"
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.pagingArrow}>{customerReport?.page}</Text>
            {currentPage < customerReport?.totalPages && (
              <TouchableOpacity style={styles.pagingArrow} onPress={Increase}>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: SIZES.large,
    textAlign: "center",
  },
  upperRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SIZES.width - 50,
    marginBottom: SIZES.xSmall,
    marginHorizontal: 20,
  },
  searchImage: {
    resizeMode: "cover",
    width: 300,
    height: 300,
    opacity: 0.9,
  },
  emptyText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: SIZES.medium,
  },
  emptyText2: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginVertical: 10,
  },
  button: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    width: SIZES.width - 20,
    fontWeight: "bold",
  },
  buttonContain: {
    marginBottom: 10,
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
  paging: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pagingArrow: {
    // marginVertical: 10,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
});
