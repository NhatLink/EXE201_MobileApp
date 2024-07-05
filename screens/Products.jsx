import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import { AnimatedTitle, ProductList } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalonInformation } from "../store/salon/action";

const Products = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const salonInformation = useSelector((state) => state.SALON.allSalon);
  const dispatch = useDispatch();
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    dispatch(fetchSalonInformation(currentPage, itemsPerPage));
  }, [currentPage, dispatch, itemsPerPage]);

  const hasItems =
    salonInformation &&
    salonInformation?.items &&
    salonInformation?.items?.length > 0;

  const Decrease = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const Increase = () => {
    if (currentPage < salonInformation?.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.upperRow}>
          <TouchableOpacity
            style={{ paddingLeft: 0 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-circle"
              size={30}
              color={COLORS.lightWhite}
            />
          </TouchableOpacity>
          <AnimatedTitle />
        </View>
        <ProductList />
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
          <Text style={styles.pagingArrow}>{salonInformation?.page}</Text>
          {currentPage < salonInformation?.totalPages && (
            <TouchableOpacity style={styles.pagingArrow} onPress={Increase}>
              <Ionicons
                name="arrow-forward-circle-outline"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}
        </View>
        {/* <ProductRow/> */}
      </View>
    </SafeAreaView>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  upperRow: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.large,
    width: SIZES.width - 50,
    top: 20,
    zIndex: 999,
  },
  title: (fam, fz, padding, color) => ({
    fontFamily: fam,
    fontSize: fz,
    paddingHorizontal: padding,
    color: color ?? COLORS.black,
  }),
  paging: {
    position: "absolute",
    bottom: 0,
    right: 50,
    left: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pagingArrow: {
    marginVertical: 10,
    padding: 10,
  },
});
