import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";
import React, { useEffect, useState } from "react";
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
} from "react-native";
import axios from "axios";
import { baseUrl } from "../utils/IP";
import SearchTile from "../components/product/SearchTile";
import SearchWhereModal from "../components/Search/SearchWhereModal";
import SearchStoreModal from "../components/Search/SearchStoreModal";
import SearchSeviceModal from "../components/Search/SearchSeviceModal";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { GetAppointmentByHistoryCustomerId } from "../store/appointment/action";
import Loader from "../components/auth/Loader";
import * as SecureStore from "expo-secure-store";
const History = () => {
  const navigation = useNavigation();
  // console.log("appoint", appointments);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { historyAppointment, loading } = useSelector(
    (state) => state.APPOINTMENT
  );
  const { user, accessToken, refreshToken, isAuthenticated } = useSelector(
    (state) => state.USER
  );
  console.log("historyAppointment:", historyAppointment);
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
      console.log("accountId", userInfo);
    }
    fetchData();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        color: COLORS.lightWhite,
        marginTop: 10,
      }}
    >
      <Loader visible={loading} />
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}> Lịch sử </Text>
      </View>

      {historyAppointment && historyAppointment.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Image
              source={require("../assets/images/error-in-calendar.png")}
              style={styles.searchImage}
            />
            <Text style={styles.emptyText}>
              Không có lịch hẹn nào được tìm thấy
            </Text>
          </View>
          <View style={styles.buttonContain}>
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
          </View>
        </View>
      ) : (
        <FlatList
          data={historyAppointment}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => <ListHistory item={item} />}
        />
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
});
