import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Button,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../../utils/helper";
import OrderTile from "../../components/orders/OrderTile";

const ImageInWork = (storeId) => {
  const navigation = useNavigation();
  const ImageInWork = [
    {
      id: 1,
      src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-tao-kieu-toc-1024x642.jpg",
      uploadDate: "2024-05-01",
    },
    {
      id: 2,
      src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-cat-toc-1024x642.jpg",
      uploadDate: "2024-05-01",
    },
    {
      id: 3,
      src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-duoi-toc-1024x642.jpg",
      uploadDate: "2024-05-01",
    },
  ];
  const [numItemsToShow, setNumItemsToShow] = useState(2);
  const loadMore = () => {
    setNumItemsToShow(numItemsToShow + 4); // Tăng số lượng sản phẩm được hiển thị lên 4
  };
  const renderProductPairs = () => {
    const pairs = [];
    for (let i = 0; i < numItemsToShow && i < ImageInWork.length; i += 2) {
      pairs.push(
        <View style={styles.serviceItem} key={i}>
          <Image
            style={styles.emptyImage}
            source={{ uri: ImageInWork[i].src }}
          />
          {/* Kiểm tra xem có sản phẩm thứ hai trong cặp không */}
          {i + 1 < numItemsToShow && i + 1 < ImageInWork.length && (
            <Image
              style={styles.emptyImage}
              source={{ uri: ImageInWork[i + 1].src }}
            />
          )}
        </View>
      );
    }
    return pairs;
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* {ImageInWork.map((item) => (
        <View
          key={item.id}
          style={styles.serviceItem}
          onPress={() => {
            // Handle navigation or other actions
          }}
        >
          <View style={styles.serviceInfo}>
            <Image style={styles.emptyImage} source={{ uri: item.src }} />
            <Text style={styles.date}>{formatDate(item?.uploadDate)}</Text>
          </View>
        </View>
      ))} */}

      {renderProductPairs()}
      {ImageInWork.length > numItemsToShow && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
          <Text style={styles.loadMoreText}>More...</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ImageInWork;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.lightWhite,
    position: "relative",
  },
  emptyImage: {
    width: SIZES.width - 50, // Chiều rộng của màn hình
    height: 300, // Chiều cao của màn hình
    resizeMode: "cover", // Điều chỉnh ảnh để vừa vặn không gian hiển thị mà không bị méo
    marginVertical: 5,
  },
  date: {
    fontSize: SIZES.xSmall,
    color: COLORS.black,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.lightWhite,
  },
  loadMoreButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightGray,
    paddingVertical: SIZES.medium,
  },
  loadMoreText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },

  serviceItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 0,
    marginHorizontal: SIZES.xSmall,
  },
});
