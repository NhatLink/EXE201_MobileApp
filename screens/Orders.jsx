import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import { Ionicons } from "@expo/vector-icons";
// import { CartList } from '../components';
import OrdersList from "../components/orders/OrdersList";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import fetchOrders from "../hook/fetchOrders";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { GetAppointmentByHistoryCustomerId } from "../store/appointment/action";

const Orders = () => {
  // const { data, isLoading, error, refetch } = fetchOrders();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const navigation = useNavigation();
  // useFocusEffect(
  //   React.useCallback(() => {
  //     refetch;
  //   }, [])
  // );
  useEffect(() => {
    async function fetchData() {
      const userInfoJson = await SecureStore.getItemAsync("userInfo");
      let userInfo = null;
      if (userInfoJson) {
        try {
          userInfo = JSON.parse(userInfoJson);
        } catch (error) {
          console.error("Error parsing userInfo", error);
        }
      }
      if (userInfo && userInfo?.id) {
        dispatch(
          GetAppointmentByHistoryCustomerId(
            currentPage,
            itemsPerPage,
            userInfo?.id
          )
        );
      }
      // console.log("accountId", userInfo);
    }
    fetchData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.navigate("Bottom Navigation")}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}> Lịch sử lịch hẹn </Text>
      </View>

      <OrdersList />
    </SafeAreaView>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.lightWhite,
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
    fontFamily: "bold",
    fontWeight: "500",
    letterSpacing: 2,
    paddingTop: SIZES.small,
    // paddingLeft: SIZES.xLarge,
    marginBottom: SIZES.xSmall,
  },
});
