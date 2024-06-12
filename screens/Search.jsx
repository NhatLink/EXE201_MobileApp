import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Animated,
} from "react-native";
import axios from "axios";
import { baseUrl } from "../utils/IP";
import SearchTile from "../components/product/SearchTile";
import SearchWhereModal from "../components/Search/SearchWhereModal";
import SearchStoreModal from "../components/Search/SearchStoreModal";
import SearchSeviceModal from "../components/Search/SearchSeviceModal";
import { useDispatch, useSelector } from "react-redux";
import { searchSalonInformation } from "../store/salon/action";
import Loader from "../components/auth/Loader";
import * as SecureStore from "expo-secure-store";
const Search = () => {
  const products = [
    {
      id: "1",
      image: [
        "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
      ],
      productName: "Haircut Classic",
      description:
        "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
      price: 15,
      avgRating: 4.2,
      reviewCount: 25,
      services: [
        {
          service_id: 1,
          serviceName: "Basic Haircut",
          description: "Quick and suitable haircut for all ages.",
          price: 150000,
          reducePrice: 120000,
          serviceTime: "30 minutes",
          images: [
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
          ],
        },
        {
          service_id: 2,
          serviceName: "Shaving",
          description: "Facial shave with a special razor, includes skin care.",
          price: 100000,
          serviceTime: "15 minutes",
          images: [
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
          ],
        },
      ],
    },
    {
      id: "2",
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
      id: "3",
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
      id: "4",
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
      id: "5",
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
    {
      id: "6",
      image: [
        "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
      ],
      productName: "Complete Grooming",
      description:
        "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
      price: 70,
      avgRating: 4.9,
      reviewCount: 20,
      services: [
        {
          service_id: 1,
          serviceName: "Basic Haircut",
          description: "Quick and suitable haircut for all ages.",
          price: 150000,
          reducePrice: 120000,
          serviceTime: "30 minutes",
          images: [
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
          ],
        },
      ],
    },
    {
      id: "7",
      image: [
        "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
      ],
      productName: "Computer hair ",
      description:
        "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
      price: 70,
      avgRating: 4.9,
      reviewCount: 20,
    },
    {
      id: "8",
      image: [
        "https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/a1a982a2-8886-4017-a735-3fde5aeab145/msbs-barbershop-perspective-22000.jpg",
      ],
      productName: "LAst ",
      description:
        "QL51/KM47 Đ. Hùng Vương, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu 790000, Việt Nam",
      price: 70,
      avgRating: 4.9,
      reviewCount: 20,
    },
  ];
  const dispatch = useDispatch();
  const [searchKeyService, setSearchKeyService] = useState("");
  const [searchKeyStore, setSearchKeyStore] = useState("");
  const [searchKeyWhere, setSearchKeyWhere] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { searchSalon } = useSelector((state) => state.SALON);
  console.log("serviceName", searchKeyService);
  console.log("salonAddress", searchKeyWhere);
  console.log("salonName", searchKeyStore);
  console.log("searchSalon", searchSalon);
  useEffect(() => {
    async function fetchData() {
      setLoader(true);
      dispatch(
        searchSalonInformation(
          searchKeyService,
          searchKeyWhere,
          searchKeyStore,
          currentPage,
          itemsPerPage
        )
      );
      setLoader(false);
    }
    fetchData();
  }, [
    searchKeyService,
    searchKeyWhere,
    searchKeyStore,
    currentPage,
    itemsPerPage,
  ]);

  const openModalWhere = () => {
    setModal1Visible(true);
  };

  const closeModalWhere = () => {
    setModal1Visible(false);
  };
  const openModalStore = () => {
    setModal2Visible(true);
  };

  const closeModalStore = () => {
    setModal2Visible(false);
  };
  const openModalService = () => {
    setModal3Visible(true);
  };

  const closeModalService = () => {
    setModal3Visible(false);
  };
  const handleSearchKeyStoreChange = (newSearchKey) => {
    setSearchKeyStore(newSearchKey);
  };
  const handleSearchKeyServiceChange = (newSearchKey) => {
    setSearchKeyService(newSearchKey);
  };
  const handleSearchKeyWhereChange = (newSearchKey) => {
    setSearchKeyWhere(newSearchKey);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        color: COLORS.lightWhite,
        // paddingHorizontal: 20,
        marginBottom: 70,
      }}
    >
      <Loader visible={loader} />
      <View style={styles.wrapper}>
        <View style={styles.searchContainer}>
          <TouchableOpacity>
            <Feather
              style={styles.searchIcon}
              name="scissors"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchWrapper}
            onPress={() => openModalService()}
          >
            <TextInput
              style={styles.searchInput}
              value={searchKeyService}
              placeholder="Dịch vụ bạn đang tìm là gì?"
              editable={false}
            />
          </TouchableOpacity>
          {searchKeyService && (
            <TouchableOpacity onPress={() => setSearchKeyService("")}>
              <Ionicons
                style={styles.deleteIcon}
                name="close-circle-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.search2}>
          <View style={styles.searchContainer2}>
            <TouchableOpacity>
              <Ionicons
                style={styles.searchIcon}
                name="location"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchWrapper}
              onPress={() => openModalWhere()}
            >
              <TextInput
                style={styles.searchInput}
                value={searchKeyWhere}
                placeholder="Vị trí?"
                editable={false}
              />
            </TouchableOpacity>
            {searchKeyWhere && (
              <TouchableOpacity onPress={() => setSearchKeyWhere("")}>
                <Ionicons
                  style={styles.deleteIcon}
                  name="close-circle-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.searchContainer3}>
            <TouchableOpacity>
              <Ionicons
                style={styles.searchIcon}
                name="storefront"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchWrapper}
              onPress={() => openModalStore()}
            >
              <TextInput
                style={styles.searchInput}
                value={searchKeyStore}
                placeholder="Tên tiệm?"
                numberOfLines={1}
                editable={false}
              />
            </TouchableOpacity>
            {searchKeyStore && (
              <TouchableOpacity onPress={() => setSearchKeyStore("")}>
                <Ionicons
                  style={styles.deleteIcon}
                  name="close-circle-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {searchSalon.length === 0 ? (
        <View style={{ flex: 1 }}>
          <Text style={styles.searchResultText}>
            {`Kết quả tìm kiếm (${searchSalon.length})`}
          </Text>
          <Image
            source={require("../assets/images/Pose23.png")}
            style={styles.searchImage}
          />
        </View>
      ) : (
        <>
          <Text style={styles.searchResultText}>
            {`Kết quả tìm kiếm (${searchSalon.length})`}
          </Text>
          <FlatList
            data={searchSalon}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => <SearchTile item={item} />}
          />
        </>
      )}
      <SearchStoreModal
        isVisible={modal2Visible}
        onClose={closeModalStore}
        onSearchKeyChange={handleSearchKeyStoreChange}
        searchKeyStore={searchKeyStore}
      />
      <SearchWhereModal
        isVisible={modal1Visible}
        onClose={closeModalWhere}
        onSearchKeyChange={handleSearchKeyWhereChange}
        searchKeySevice={searchKeyWhere}
      />
      <SearchSeviceModal
        isVisible={modal3Visible}
        onClose={closeModalService}
        onSearchKeyChange={handleSearchKeyServiceChange}
        searchKeySevice={searchKeyService}
      />
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 20 },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginTop: SIZES.medium,
    height: 50,
  },
  searchContainer2: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginTop: SIZES.small,
    marginBottom: SIZES.medium,
    marginRight: SIZES.xSmall,
    height: 50,
    width: "49%",
  },
  searchContainer3: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginTop: SIZES.small,
    marginBottom: SIZES.medium,
    height: 50,
    width: "49%",
  },
  search2: {
    flexDirection: "row",
    // backgroundColor: COLORS.secondary,
    // borderRadius: SIZES.medium,
    // marginTop: SIZES.small,
    // marginBottom: SIZES.medium,
    // height: 50,
    // width: "50%",
  },
  searchImage: {
    resizeMode: "contain",
    width: SIZES.width - 50,
    height: SIZES.height - 300,
    opacity: 0.9,
  },

  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    marginRight: SIZES.xSmall,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.small,
    height: "100%",
  },
  searchInput: {
    fontFamily: "regular",
    color: COLORS.black,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.xSmall,
  },
  searchBtn: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },

  searchIcon: {
    marginLeft: 10,
    color: "gray",
  },
  deleteIcon: {
    // position: "absolute",
    // top: 12,
    // right: 10,
    marginRight: 5,
    color: "gray",
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 35,
    backgroundColor: COLORS.lightWhite,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    marginLeft: 10,
    fontSize: SIZES.small,
  },
  modalTextTitle: {
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
    marginLeft: 10,
    fontSize: SIZES.medium,
  },
  buttonClose: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
  },
  textStyle: {
    color: COLORS.black,
    fontWeight: "bold",
    textAlign: "center",
  },
  searchResultText: {
    fontWeight: "bold",
    textAlign: "left",
    fontSize: SIZES.medium,
    paddingHorizontal: 20,
  },
});
