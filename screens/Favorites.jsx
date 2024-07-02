import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { COLORS, SIZES, SHADOWS } from "../constants";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
const Favorites = ({ navigation }) => {
  const [favoritesData, setFavoritesData] = useState([]);
  console.log("favoritesData", favoritesData);

  useFocusEffect(
    useCallback(() => {
      checkFavorites();
    }, [checkFavorites]) // Không cần trả về hàm dọn dẹp trong trường hợp này
  );

  const checkFavorites = useCallback(async () => {
    const userId = await SecureStore.getItemAsync("accountId");
    if (userId !== null) {
      const favoritesId = `favorites${userId}`;
      console.log("fav", favoritesId);
      try {
        const favoritesObj = await SecureStore.getItemAsync(favoritesId);
        if (favoritesObj !== null) {
          const favorites = JSON.parse(favoritesObj);
          const favoritesArray = Object.values(favorites);
          setFavoritesData(favoritesArray);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const deleteFavorite = async (id) => {
    const userId = await SecureStore.getItemAsync("accountId");
    const favoritesId = `favorites${userId}`;
    console.log(favoritesId);
    let productId = id;
    try {
      const existingItem = await SecureStore.getItemAsync(favoritesId);
      let favoritesObj = existingItem ? JSON.parse(existingItem) : {};

      if (favoritesObj[productId]) {
        delete favoritesObj[productId];

        await checkFavorites();
      } else {
        console.log(`Key does not exist: ${productId}`);
        navigation.navigate("Home");
      }

      await SecureStore.setItem(favoritesId, JSON.stringify(favoritesObj));
    } catch (error) {
      console.log(error);
    }
  };
  // const favoritesData = [
  //   {
  //     _id: "1",
  //     image:
  //       "https://www.gento.vn/wp-content/uploads/2024/04/barber-la-gi-8.jpg",
  //     productName: "Shop 1",
  //     description: "Description for Shop 1",
  //     price: 19.99,
  //   },
  //   {
  //     _id: "2",
  //     image:
  //       "https://www.gento.vn/wp-content/uploads/2024/04/barber-la-gi-8.jpg",
  //     productName: "Shop 2",
  //     description: "Description for Shop 2",
  //     price: 29.99,
  //   },
  //   {
  //     _id: "3",
  //     image:
  //       "https://www.gento.vn/wp-content/uploads/2024/04/barber-la-gi-8.jpg",
  //     productName: "Shop 3",
  //     description: "Description for Shop 3",
  //     price: 39.99,
  //   },
  //   {
  //     _id: "4",
  //     image:
  //       "https://www.gento.vn/wp-content/uploads/2024/04/barber-la-gi-8.jpg",
  //     productName: "Shop 4",
  //     description: "Description for Shop 4",
  //     price: 49.99,
  //   },
  // ];

  // console.log(favoritesData);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}> Salon/Barber yêu thích </Text>
      </View>
      {favoritesData?.length > 0 ? (
        <FlatList
          data={favoritesData}
          renderItem={({ item }) => (
            // Render your favorite item here
            <View>
              <TouchableOpacity
                style={styles.favcontainer}
                onPress={() =>
                  navigation.navigate("Details", { product: item?.id })
                }
              >
                <TouchableOpacity style={styles.imageContainer}>
                  <Image
                    source={{ uri: item?.img }}
                    resizeMode="cover"
                    style={styles.productImg}
                  />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                  <Text style={styles.productTxt} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <Text style={styles.supplierTxt} numberOfLines={1}>
                    {item.address}
                  </Text>
                  {/* <Text style={styles.supplierTxt} numberOfLines={1}>
                    $ {item.price}
                  </Text> */}
                </View>
                <TouchableOpacity onPress={() => deleteFavorite(item.id)}>
                  <SimpleLineIcons name="trash" size={24} color="black" />
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
              Không có yêu thích nào được tìm thấy
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Text style={styles.button}>Tìm kiếm salon barber</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  upperRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SIZES.width - 50,
    marginBottom: SIZES.xSmall,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  favcontainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: SIZES.xSmall,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    backgroundColor: "#FFF",
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
    fontFamily: "bold",
    color: COLORS.primary,
  },
  supplierTxt: {
    fontSize: SIZES.small + 2,
    fontFamily: "regular",
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
