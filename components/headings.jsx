import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SIZES } from "../constants";
import ProductSpecialViewCard from "./ProductSpecialViewCard";
import { useSelector } from "react-redux";
const Headings = () => {
  const navigation = useNavigation();
  const salonInformation = useSelector((state) => state.SALON.allSalon);
  const datajson = [
    {
      id: "1",
      image: require("../assets/images/cat-toc-cho-be.jpg"),
      company: "Cắt tóc trẻ em",
    },
    {
      id: "2",
      image: require("../assets/images/Cắt tóc nam.jpg"),
      company: "Cắt tóc nam",
    },
    {
      id: "3",
      image: require("../assets/images/Cắt tóc nữ.jpg"),
      company: "Cắt tóc nữ",
    },
    {
      id: "4",

      image: require("../assets/images/Nhuộm tóc.jpg"),
      company: "Nhuộm tóc",
    },
    {
      id: "5",

      image: require("../assets/images/Uốn duỗi tóc.jpg"),
      company: "Uốn duỗi tóc",
    },
    {
      id: "6",
      image: require("../assets/images/Nối tóc.webp"),
      company: "Nối tóc",
    },
    {
      id: "7",
      image: require("../assets/images/Chăm sóc tóc.jpg"),
      company: "Chăm sóc tóc",
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        <Text style={styles.headerTitle}>Tìm kiếm dịch vụ nổi bật</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.container}
        >
          {datajson.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => navigation.navigate("Search")}
            >
              <Image source={item.image} style={styles.image} />
              <Text style={styles.text}>{item.company}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Khám phá</Text>
        {/* <TouchableOpacity onPress={() => navigation.navigate("New-Rivals")}>
          <Ionicons
            name="chevron-forward-circle-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity> */}
      </View>
      <View style={styles.cardsContainer}>
        {/* {isLoading ? (
          <ActivityIndicator size="large" colors={COLORS.primary} />
        ) : error ? (
          <Text>Something went south</Text>
        ) : ( */}
        <FlatList
          data={salonInformation}
          renderItem={({ item }) => <ProductSpecialViewCard item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ columnGap: SIZES.medium }}
          horizontal
        />
        {/* )} */}
      </View>
    </View>
  );
};

export default Headings;

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.medium,
    marginBottom: -SIZES.xSmall,
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
  item: {
    alignItems: "center", // Canh giữa các items theo chiều dọc và ngang
    marginRight: 15,
  },
  filtersContainer: {
    paddingBottom: 20,
  },
  image: {
    width: 80, // Đặt kích thước cho hình ảnh
    height: 80, // Đặt kích thước cho hình ảnh
    borderRadius: 40, // Làm tròn hình ảnh
    overflow: "hidden", // Ẩn các phần bị cắt của hình ảnh
  },
  text: {
    marginTop: 5, // Khoảng cách giữa hình ảnh và text
  },
  cardsContainer: {
    marginTop: 0,
  },
});
