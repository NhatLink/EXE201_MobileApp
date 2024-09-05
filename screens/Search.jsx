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
  RefreshControl,
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
import SearchMapModal from "../components/Search/SearchMapModal";
const Search = () => {
  const dispatch = useDispatch();
  const [searchKeyService, setSearchKeyService] = useState("");
  const [searchKeyStore, setSearchKeyStore] = useState("");
  const [searchKeyWhere, setSearchKeyWhere] = useState("");
  const [markerPosition, setMarkerPosition] = useState({
    latitude: null,
    longitude: null,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { searchSalon } = useSelector((state) => state.SALON);
  // console.log("markerPosition", markerPosition);

  const Decrease = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const Increase = () => {
    if (currentPage < searchSalon?.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  useEffect(() => {
    async function fetchData() {
      setLoader(true);
      dispatch(
        searchSalonInformation(
          searchKeyService,
          searchKeyWhere,
          searchKeyStore,
          currentPage,
          itemsPerPage,
          markerPosition.latitude,
          markerPosition.longitude
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
    markerPosition,
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(
      searchSalonInformation(
        searchKeyService,
        searchKeyWhere,
        searchKeyStore,
        currentPage,
        itemsPerPage,
        markerPosition.latitude,
        markerPosition.longitude
      )
    );
    setRefreshing(false);
  };

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
  const handleSearchLocationChange = (newSearchKey) => {
    setMarkerPosition(newSearchKey);
  };
  return (
    <SafeAreaView style={styles.container}>
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
          {/* <View style={styles.searchContainer2}>
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
          </View> */}
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
      {searchSalon && searchSalon?.items && searchSalon?.items?.length === 0 ? (
        <View style={{ flex: 1 }}>
          <Text style={styles.searchResultText}>
            {`Kết quả tìm kiếm (${searchSalon?.items?.length ?? 0})`}
          </Text>
          <Image
            source={require("../assets/images/Pose23.png")}
            style={styles.searchImage}
          />
          <View style={styles.searchContainer2}>
            <TouchableOpacity onPress={() => openModalWhere()}>
              <Ionicons
                style={styles.searchMapIcon}
                name="location"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.searchResultText}>
            {`Kết quả tìm kiếm (${searchSalon?.items?.length ?? 0})`}
          </Text>
          <FlatList
            data={searchSalon.items}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => <SearchTile item={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={
              <View style={styles.paging}>
                {currentPage > 1 && (
                  <TouchableOpacity
                    style={styles.pagingArrow}
                    onPress={Decrease}
                  >
                    <Ionicons
                      name="arrow-back-circle-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                )}
                <Text style={styles.pagingArrow}>{searchSalon?.page}</Text>
                {currentPage < searchSalon?.totalPages && (
                  <TouchableOpacity
                    style={styles.pagingArrow}
                    onPress={Increase}
                  >
                    <Ionicons
                      name="arrow-forward-circle-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                )}
              </View>
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
            <Text style={styles.pagingArrow}>{searchSalon?.page}</Text>
            {currentPage < searchSalon?.totalPages && (
              <TouchableOpacity style={styles.pagingArrow} onPress={Increase}>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            )}
          </View> */}
          <View style={styles.searchContainer2}>
            <TouchableOpacity onPress={() => openModalWhere()}>
              <Ionicons
                style={styles.searchMapIcon}
                name="location"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
      <SearchStoreModal
        isVisible={modal2Visible}
        onClose={closeModalStore}
        onSearchKeyChange={handleSearchKeyStoreChange}
        searchKeyStore={searchKeyStore}
      />
      <SearchMapModal
        isVisible={modal1Visible}
        onClose={closeModalWhere}
        onSearchKeyChange={handleSearchKeyWhereChange}
        onSearchLocation={handleSearchLocationChange}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  wrapper: { paddingHorizontal: 20 },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.cardcolor,
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
    height: 50,
    position: "absolute",
    bottom: 10,
    left: 10,
    zIndex: 99,
    paddingHorizontal: 15,
  },
  searchContainer3: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.cardcolor,
    borderRadius: SIZES.medium,
    marginTop: SIZES.small,
    marginBottom: SIZES.medium,
    height: 50,
    width: "100%",
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
    backgroundColor: COLORS.cardcolor,
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
  searchMapIcon: {
    color: COLORS.black,
  },
  deleteIcon: {
    // position: "absolute",
    // top: 12,
    // right: 10,
    marginRight: 5,
    color: COLORS.black,
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
  paging: {
    // position: "absolute",
    // bottom: 0,
    // right: "50%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pagingArrow: {
    // marginVertical: 10,
    padding: 10,
  },
});
