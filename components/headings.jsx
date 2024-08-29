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
      image:
        "https://thegioitongdo.net/wp-content/uploads/2018/01/cat-toc-cho-be.jpg",
      company: "Cắt tóc trẻ em",
    },
    {
      id: "2",
      image:
        "https://tocnamdep.com/wp-content/uploads/2020/06/1557200230-1526030688-4-ti-m-c-t-toc-nam-p-qu-n-10-ang-m-t-l-n-n-va-tr-i-nghi-m.jpg",
      company: "Cắt tóc nam",
    },
    {
      id: "3",
      image:
        "https://hocvientoc.edu.vn/wp-content/uploads/2019/05/lich-cat-toc-nu-thang-5.jpg",
      company: "Cắt tóc nữ",
    },
    {
      id: "4",

      image:
        "https://cdn.sanity.io/images/zqgvoczt/vietnam-migration/6d9d446d8510d7c052e77cbc731bf1759343ce7d-1200x800.jpg",
      company: "Nhuộm tóc",
    },
    {
      id: "5",

      image:
        "https://cdn.tgdd.vn/Files/2022/10/23/1480947/cac-tieu-chi-chon-mua-may-uon-duoi-toc-ban-nen-biet-10.jpg",
      company: "Uốn duỗi tóc",
    },
    {
      id: "6",
      image:
        "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/noi_toc_la_gi_noi_toc_bao_nhieu_tien_2_27ea59edf6.jpg",
      company: "Nối tóc",
    },
    {
      id: "7",
      image:
        "https://milaganics.com/wp-content/uploads/sites/10/2020/12/cham-soc-toc-chuan-spa.jpg",
      company: "Chăm sóc tóc",
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        <Text style={styles.headerTitle}>Dịch vụ nổi bật</Text>
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
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.text}>{item.company}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Khám phá</Text>
        <TouchableOpacity onPress={() => navigation.navigate("New-Rivals")}>
          <Ionicons
            name="chevron-forward-circle-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
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
