import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import ProductCardView from "../ProductViewCard";
import { COLORS, SIZES } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalonInformation } from "../../store/salon/action";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const salonInformation = useSelector((state) => state.SALON.allSalon);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchSalonInformation(currentPage, itemsPerPage));
    setRefreshing(false);
  };

  if (refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={salonInformation.items}
        renderItem={({ item }) => <ProductCardView item={item} />}
        numColumns={2}
        contentContainerStyle={styles.container}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {/* <View style={styles.paging}>
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
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: SIZES.xxLarge,
    paddingLeft: SIZES.small / 2,
  },
  separator: {
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  // paging: {
  //   position: "absolute",
  //   bottom: 0,
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // pagingArrow: {
  //   marginVertical: 10,
  //   padding: 10,
  // },
});

export default ProductList;
