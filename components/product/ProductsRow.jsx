import { useState } from "react";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  ScrollView,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
// import useFetch from "../../hook/useFetch";
import ProductViewCard from "../ProductViewCard";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ProductRow = () => {
  // const { data, isLoading, error } = useFetch();
  const [numItemsToShow, setNumItemsToShow] = useState(4); // Trạng thái để theo dõi số lượng sản phẩm hiện đang được hiển thị
  const navigation = useNavigation();
  const loadMore = () => {
    setNumItemsToShow(numItemsToShow + 4); // Tăng số lượng sản phẩm được hiển thị lên 4
  };
  const products = [
    {
      _id: "1",
      image: [
        "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
      ],
      productName: "Haircut Classic",
      description:
        "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
      price: 15,
      avgRating: 4.2,
      reviewCount: 25,
    },
    {
      _id: "2",
      image: [
        "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
      ],
      productName: "Beard Trim",
      description:
        "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
      price: 10,
      avgRating: 4.5,
      reviewCount: 18,
    },
    {
      _id: "3",
      image: [
        "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
      ],
      productName: "Hair Coloring",
      description:
        "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
      price: 50,
      avgRating: 4.8,
      reviewCount: 10,
    },
    {
      _id: "4",
      image: [
        "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
      ],
      productName: "Hair Wash",
      description:
        "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
      price: 8,
      avgRating: 4.0,
      reviewCount: 30,
    },
    {
      _id: "5",
      image: [
        "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
      ],
      productName: "Complete Grooming",
      description:
        "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
      price: 70,
      avgRating: 4.9,
      reviewCount: 20,
    },
  ];
  // Render các cặp sản phẩm
  const renderProductPairs = () => {
    const pairs = [];
    for (let i = 0; i < numItemsToShow && i < products.length; i += 2) {
      pairs.push(
        <View style={styles.productPair} key={i}>
          <ProductViewCard item={products[i]} />
          {/* Kiểm tra xem có sản phẩm thứ hai trong cặp không */}
          {i + 1 < numItemsToShow && i + 1 < products.length && (
            <ProductViewCard item={products[i + 1]} />
          )}
        </View>
      );
    }
    return pairs;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recommennded</Text>
        <TouchableOpacity onPress={() => navigation.navigate("New-Rivals")}>
          <Ionicons
            name="chevron-forward-circle-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.cardsContainer}>
          {/* {isLoading ? (
            <ActivityIndicator size="large" colors={COLORS.primary} />
          ) : error ? (
            <Text>Something went south</Text>
          ) : ( */}
          <>
            {renderProductPairs()}
            {products.length > numItemsToShow && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMore}
              >
                <Text style={styles.loadMoreText}>More...</Text>
              </TouchableOpacity>
            )}
          </>
          {/* )} */}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductRow;

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.small,
    marginBottom: 120,
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
    // marginTop: SIZES.medium,
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
});
