import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { Ionicons, Feather } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";

const GOOGLE_API_KEY = "AIzaSyCmAt2KHp7yJVDWMWlrd_uUMtvzhSExNaQ";
const SearchWhereModal = ({
  isVisible,
  onClose,
  onSearchKeyChange,
  searchKeyWhere,
}) => {
  const [searchKey, setSearchKey] = useState("");
  // const [location, setLocation] = useState("Ho Chi Minh, Vietnam");
  console.log("searchKeyWhere", searchKey);
  const { width, height } = useWindowDimensions();
  const handleSearch = async (data, details) => {
    Keyboard.dismiss();
    try {
      if (onSearchKeyChange) {
        onSearchKeyChange(data.description);
      }
      onClose();
    } catch (error) {
      console.error("Failed to perform search:", error);
    }
  };
  const handleManualSearch = () => {
    Keyboard.dismiss();
    try {
      if (onSearchKeyChange) {
        onSearchKeyChange(searchKey);
      }
      onClose();
    } catch (error) {
      console.error("Failed to perform search:", error);
    }
  };

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return false;
    }
    return true;
  };

  const getLocation = async () => {
    if (await requestLocationPermission()) {
      try {
        let { coords } = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        console.log(address);
        if (address.length > 0) {
          // setLocation(address[0].subregion + ", " + address[0].region);
          try {
            if (onSearchKeyChange) {
              // const parts = address[0].formattedAddress.split(",").slice(-4); // Tách chuỗi và lấy ba phần tử cuối cùng
              // const formattedAddress = parts.join(",").trim();
              onSearchKeyChange(
                address[0].subregion + ", " + address[0].region
                // formattedAddress
              );
            }
            onClose();
          } catch (error) {
            console.error("Failed to perform search:", error);
          }
        }
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Unable to retrieve location. Please try again.");
      }
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
        <Text style={styles.modalTextTitle}>Tìm kiếm theo vị trí</Text>
        <View style={styles.searchContainer}>
          <Ionicons
            style={styles.searchIcon}
            name="location"
            size={24}
            color="black"
          />
          <GooglePlacesAutocomplete
            placeholder="Bạn đang tìm gì?"
            textInputProps={{
              value: searchKey,
              onChangeText: (text) => {
                console.log("onChangeText called with:", text);
                setSearchKey(text);
              },
            }}
            onPress={handleSearch}
            query={{
              key: GOOGLE_API_KEY,
              language: "vi", // Ngôn ngữ tìm kiếm
            }}
            styles={{
              textInputContainer: {
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 10,
              },
              textInput: {
                height: 38,
                color: "#5d5d5d",
                backgroundColor: COLORS.secondary,
                fontSize: 16,
                flex: 1,
              },
              listView: {
                // width: width,
                marginHorizontal: 10,
              },
            }}
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={handleManualSearch}
          >
            <Ionicons
              name="search"
              size={SIZES.xLarge}
              color={COLORS.offwhite}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.locationBtn} onPress={getLocation}>
          <Ionicons style={styles.text} name="locate" size={24} color="red" />
          <Text style={styles.text}>Lấy vị trí hiện tại</Text>
        </TouchableOpacity>
        {/* <Text style={styles.textStylet}>{location}</Text> */}
      </View>
      <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
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
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    // marginTop: SIZES.small,
    padding: 10,
    // height: 50,
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
    // width: 50,
    // height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    // marginHorizontal: 10,
    padding: 7,
  },
  locationBtn: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 10,
  },
  searchIcon: {
    color: "gray",
    paddingVertical: 7,
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
  text: {
    color: COLORS.lightWhite,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SearchWhereModal;
