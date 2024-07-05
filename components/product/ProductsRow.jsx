import { useState, useEffect, useRef } from "react";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  ScrollView,
  FlatList,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import ProductViewCard from "../ProductViewCard";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalonInformation } from "../../store/salon/action";
const ProductRow = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const dispatch = useDispatch();
  const salonInformation = useSelector((state) => state.SALON.allSalon);

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đề cử</Text>
      </View>
      <View style={styles.cardsContainer}>
        {salonInformation &&
        salonInformation.items &&
        salonInformation.items.length > 0 ? (
          salonInformation.items.map((item) => (
            <ProductViewCard style={styles.card} key={item.id} item={item} />
          ))
        ) : (
          <Text>Not found!!</Text>
        )}
      </View>
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
    </View>
  );
};

export default ProductRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    fontFamily: "semibold",
    color: COLORS.black,
  },
  headerBtn: {
    fontSize: SIZES.medium,
    fontFamily: "medium",
    color: COLORS.gray,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productPair: {
    flexDirection: "row", // Hiển thị các sản phẩm trong một cặp theo hàng ngang
    justifyContent: "space-between",
    // marginBottom: SIZES.small, // Khoảng cách giữa các cặp sản phẩm
  },
  loadMoreButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightGray,
    paddingVertical: SIZES.medium,
    // marginTop: SIZES.medium,
  },
  loadMoreText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  card: {
    width: "50%",
  },
  paging: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pagingArrow: {
    marginVertical: 10,
    padding: 10,
  },
});
// const products = [
//   {
//     _id: "1",
//     image: [
//       "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
//     ],
//     productName: "Haircut Classic",
//     description:
//       "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
//     price: 15,
//     avgRating: 4.2,
//     reviewCount: 25,
//   },
//   {
//     _id: "2",
//     image: [
//       "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
//     ],
//     productName: "Beard Trim",
//     description:
//       "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
//     price: 10,
//     avgRating: 4.5,
//     reviewCount: 18,
//   },
//   {
//     _id: "3",
//     image: [
//       "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
//     ],
//     productName: "Hair Coloring",
//     description:
//       "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
//     price: 50,
//     avgRating: 4.8,
//     reviewCount: 10,
//   },
//   {
//     _id: "4",
//     image: [
//       "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
//     ],
//     productName: "Hair Wash",
//     description:
//       "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
//     price: 8,
//     avgRating: 4.0,
//     reviewCount: 30,
//   },
//   {
//     _id: "5",
//     image: [
//       "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
//     ],
//     productName: "Complete Grooming",
//     description:
//       "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
//     price: 70,
//     avgRating: 4.9,
//     reviewCount: 20,
//   },
// ];
