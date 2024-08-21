import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";
import { useNavigation } from "@react-navigation/native";
import addToCart from "../hook/addToCart";
import StarRating from "./StarRating";

const ProductSpecialViewCard = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Details", { product: item?.id })}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item?.img }} style={styles.image} />
          <View style={styles.ratingContainer}>
            {/* <StarRating rating={item?.avgRating} /> */}
            <Text style={styles.averageRatingText}>
              {item?.totalRating > 0
                ? (item?.rate).toFixed(1) + "/5.0"
                : "Không có đánh giá"}
            </Text>
            <Text style={styles.averageRatingText}>
              {item?.totalReviewer
                ? item?.totalReviewer + " đánh giá"
                : "(0 đánh giá)"}
            </Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {item?.name}
          </Text>
          <Text style={styles.supplier} numberOfLines={2}>
            {item?.description}
          </Text>
          <Text style={styles.supplier} numberOfLines={2}>
            <Text style={styles.supplierStrong} numberOfLines={2}>
              {"Địa chỉ: "}
            </Text>
            {item?.address}
          </Text>
          {/* <Text style={styles.price} numberOfLines={1}>
            SALE UP TO {item?.price}%
          </Text> */}
        </View>
        {/* <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item?._id, 1)}
        >
          <Ionicons name="add-circle" size={35} color={COLORS.primary} />
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

export default ProductSpecialViewCard;

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: "auto",
    marginEnd: 10,
    marginVertical: SIZES.medium,
    borderRadius: SIZES.small,
    backgroundColor: COLORS.cardcolor,
  },
  imageContainer: {
    flex: 1,
    width: 280,
    marginLeft: SIZES.medium / 2,
    marginTop: SIZES.medium / 2,
    borderRadius: SIZES.small,
    overflow: "hidden",
  },
  image: {
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: SIZES.small,
  },
  detailsContainer: {
    padding: SIZES.small,
  },
  name: {
    fontSize: SIZES.medium,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 1,
  },
  supplier: {
    fontFamily: "regular",
    fontSize: SIZES.xSmall,
    color: COLORS.black,
  },
  supplierStrong: {
    fontFamily: "regular",
    fontSize: SIZES.xSmall,
    color: COLORS.black,
    fontWeight: "bold",
  },
  price: {
    fontSize: SIZES.medium,
    fontFamily: "bold",
    color: COLORS.black,
    backgroundColor: COLORS.tertiary,
    borderRadius: 5,
    overflow: "hidden",
    paddingLeft: 5,
    maxWidth: 150,
  },
  addButton: {
    position: "absolute",
    bottom: SIZES.xSmall,
    right: SIZES.xSmall,
  },
  ratingContainer: {
    flexDirection: "column",
    backgroundColor: COLORS.banner,
    position: "absolute",
    top: 0,
    right: 0,
    borderTopEndRadius: 10,
    borderBottomStartRadius: 10,
    padding: 5,
  },
  averageRatingText: {
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    fontSize: SIZES.small,
  },
});
