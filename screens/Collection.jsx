import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { COLORS, SIZES, SHADOWS } from "../constants";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import NewCollectionModal from "../components/Collection/NewCollectionModal";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteCustomerImageHistory,
  GetCustomerImageHistoryByCustomerId,
} from "../store/collection/action";
import Loader from "../components/auth/Loader";
import formatDate from "../utils/helper";
const Collection = ({ navigation }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { user } = useSelector((state) => state.USER);
  const { collection, loading } = useSelector((state) => state.COLLECTION);

  const CollectionData = [
    {
      id: "a",
      title: "Collection 1",
      note: "Collection 1 alala Collection 1 alala Collection 1 alala Collection 1 alala",
      img: "data:image/jpeg;base64,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",
    },
    {
      id: "b",
      title: "Collection 2 Collection 2 Collection 2",
      note: "Collection 2 alala",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQINuQpLmXsUfEa4Y0Lfsc2ivz-pZDc-NU_A&s",
    },
  ];

  useEffect(() => {
    if (user && user.id) {
      dispatch(
        GetCustomerImageHistoryByCustomerId(currentPage, itemsPerPage, user.id)
      );
    }
  }, [currentPage, itemsPerPage, user, user.id]);

  const deleteCollection = (id) => {
    if (id && user && user.id) {
      dispatch(DeleteCustomerImageHistory(id, user.id));
    }
  };

  const deleteCollectionConfirm = (name, id) => {
    Alert.alert(
      `Xóa bộ sưu tập ${name}`,
      "Bạn chắc chắn muốn xóa?",
      [
        { text: "Đóng", onPress: () => console.log("Cancel pressed") },
        {
          text: "Tiếp tục xóa",
          onPress: () => {
            deleteCollection(id);
          },
        },
      ],
      { defaultIndex: 1 } // Index 1 corresponds to the "Delete" button
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.upperRow}>
          <TouchableOpacity
            style={{ paddingLeft: 0 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-circle"
              size={30}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.title}> Kho lưu trữ</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <Loader visible={loading} /> */}
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}> Kho lưu trữ</Text>
      </View>
      {collection?.items?.length > 0 && (
        <TouchableOpacity
          style={styles.newCollection}
          onPress={() => setModalVisible(true)}
        >
          <Text>+ Thêm bộ sưu tập</Text>
        </TouchableOpacity>
      )}
      {collection?.items?.length > 0 ? (
        <FlatList
          data={collection?.items}
          renderItem={({ item }) => (
            // Render your favorite item here
            <View>
              <TouchableOpacity
                style={styles.favcontainer}
                onPress={() =>
                  navigation.navigate("DetailCollection", {
                    collectionId: item?.id,
                    nameCollection: {
                      title: item.title,
                      note: item.description,
                    },
                    imgCollection: item.imageStyles,
                  })
                }
              >
                <TouchableOpacity style={styles.imageContainer}>
                  <Image
                    source={{ uri: item?.imageStyles[0]?.urlImage }}
                    resizeMode="cover"
                    style={styles.productImg}
                  />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                  <Text style={styles.productTxt} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.supplierTxt} numberOfLines={3}>
                    {item.description}
                  </Text>
                  <Text style={styles.supplierTxt} numberOfLines={3}>
                    Ngày tạo: {formatDate(item.createdDate)}
                  </Text>
                  {/* <Text style={styles.supplierTxt} numberOfLines={1}>
                      $ {item.price}
                    </Text> */}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    deleteCollectionConfirm(item.title, item.id);
                  }}
                >
                  <SimpleLineIcons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View
          style={{
            // flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ marginBottom: 20 }}>
            <Image
              source={require("../assets/images/error-in-calendar.png")}
              // source={{
              //   uri: "https://banner2.cleanpng.com/20180320/jdq/kisspng-heart-love-red-favorite-5ab09a2c3c8919.626171351521523244248.jpg",
              // }}
              style={styles.searchImage}
            />
            <Text style={styles.emptyText}>
              Không có bộ sưu tập nào được tìm thấy
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Text style={styles.button}>
                Tìm kiếm các salon shop / barber
              </Text>
            </TouchableOpacity>
            <Text style={styles.emptyText2}>
              ---------------Hoặc---------------
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.button}>Tạo bộ sưu tập mới</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <NewCollectionModal
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(!modalVisible);
        }}
        data={{
          CustomerId: user.id,
        }}
      />
    </SafeAreaView>
  );
};

export default Collection;

const styles = StyleSheet.create({
  container: {
    // marginTop: 20,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: COLORS.background,
  },
  upperRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SIZES.width - 50,
    marginVertical: SIZES.xSmall,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: COLORS.background,
  },
  newCollection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: SIZES.width - 50,
    marginBottom: SIZES.large,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: "bold",
  },
  favcontainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: SIZES.xSmall,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    backgroundColor: COLORS.cardcolor,
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  },
  imageContainer: {
    width: 70,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  productImg: {
    width: "100%",
    height: 65,
    borderRadius: SIZES.small,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: SIZES.medium,
  },
  productTxt: {
    fontSize: SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  supplierTxt: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 3,
    textTransform: "capitalize",
  },
  searchImage: {
    resizeMode: "cover",
    width: SIZES.width - 500,
    height: SIZES.height - 500,
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
});
