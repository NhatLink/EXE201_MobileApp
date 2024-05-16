import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TextInput,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { Ionicons, Feather } from "@expo/vector-icons";

const SearchStoreModal = ({
  isVisible,
  onClose,
  onSearchKeyChange,
  searchKeyStore,
}) => {
  const [searchKey, setSearchKey] = useState(searchKeyStore);
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = async () => {
    Keyboard.dismiss();
    try {
      // const encodedSearchKey = encodeURIComponent(searchKey);
      // const url = `${baseUrl}/product/searchProductByName?productName=${encodedSearchKey}`;

      // const response = await axios.get(url);
      // setSearchResults(response.data.products);
      // console.log("Search data: ", response.data.products);

      // Call the onSearchKeyChange prop to update the parent component
      if (onSearchKeyChange) {
        onSearchKeyChange(searchKey);
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Failed to perform search:", error);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenModal}>
        <Text style={styles.modalTextTitle}>Tìm kiếm theo tên cửa hàng</Text>
        <View style={styles.searchContainer}>
          <TouchableOpacity>
            <Ionicons
              style={styles.searchIcon}
              name="storefront"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              value={searchKey}
              onChangeText={setSearchKey}
              placeholder="Bạn đang tìm gì?"
            />
          </View>

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Ionicons
              name="search"
              size={SIZES.xLarge}
              color={COLORS.offwhite}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
        {/* <Text style={styles.textStyle}>Close</Text> */}
        <Ionicons
          style={styles.textStyle}
          name="return-up-back"
          size={24}
          color="black"
        />
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenModal: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: COLORS.lightWhite,
    color: COLORS.lightWhite,
    paddingHorizontal: 20,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginTop: SIZES.small,
    height: 50,
  },
  searchImage: {
    resizeMode: "contain",
    width: SIZES.width - 100,
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
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    marginLeft: 10,
    fontSize: SIZES.small,
  },
  modalTextTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10,
    fontSize: SIZES.medium,
  },
  buttonClose: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
  },
  textStyle: {
    color: COLORS.black,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SearchStoreModal;
