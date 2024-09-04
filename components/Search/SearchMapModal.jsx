import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TextInput,
  useWindowDimensions,
  Alert,
  ToastAndroid,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { Ionicons, Feather } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const GOOGLE_API_KEY = "AIzaSyAs7hqe3ZUJTjrM7KbdVqkdxB__0eCcKgE";
const SearchMapModal = ({
  isVisible,
  onClose,
  onSearchKeyChange,
  onSearchLocation,
  searchKeyWhere,
}) => {
  const mapRef = React.useRef(null);
  const [searchKey, setSearchKey] = useState("");

  const [region, setRegion] = useState(null); // Vị trí hiện tại
  const [markerPosition, setMarkerPosition] = React.useState({
    latitude: 10.875123789279687, // Vị trí mặc định
    longitude: 106.79814847509016, // Vị trí mặc định
  });

  useEffect(() => {
    getMarkLocation();
  }, []);

  //   const handleSearch = async (data, details) => {
  //     let desiredDescription = data.description.replace(", Việt Nam", "");
  //     Keyboard.dismiss();
  //     try {
  //       if (onSearchKeyChange) {
  //         onSearchKeyChange(desiredDescription);
  //       }
  //       onClose();
  //     } catch (error) {
  //       console.error("Failed to perform search:", error);
  //     }
  //   };

  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const { lat, lng } = data.result.geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.error("Failed to fetch place details:", data.status);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const handleSearch = async (data, details = null) => {
    if (details) {
      const placeId = details.place_id;
      const location = await fetchPlaceDetails(placeId);
      if (location) {
        const { latitude, longitude } = location;
        setMarkerPosition({ latitude, longitude });
      }
    }
  };

  const handleManualSearch = () => {
    Keyboard.dismiss();
    try {
      //   if (onSearchKeyChange) {
      //     onSearchKeyChange(searchKey);
      //   }
      if (markerPosition) {
        onSearchLocation(markerPosition);
      }

      onClose();
    } catch (error) {
      console.error("Failed to perform search:", error);
    }
  };

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Yêu cầu vị trí bị từ chối !");
      return false;
    }
    return true;
  };

  const getMarkLocation = async () => {
    if (await requestLocationPermission()) {
      try {
        let { coords } = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setMarkerPosition({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert(
          "Lỗi",
          "Chưa thể lấy được vị trí của người dùng, vui lòng thử lại sau!"
        );
      }
    }
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    console.log(latitude);
    console.log(longitude);

    // Kiểm tra tọa độ có nằm trong phạm vi Việt Nam không
    if (
      latitude >= 8.43 &&
      latitude <= 23.39 &&
      longitude >= 102.14 &&
      longitude <= 109.46
    ) {
      setMarkerPosition({
        latitude,
        longitude,
      });
      // Lưu lại kinh độ và vĩ độ
    } else {
      ToastAndroid.show(
        "Vị trí bạn chọn phải nằm trong lãnh thổ Việt Nam",
        ToastAndroid.SHORT
      );
      //   Alert.alert("Lỗi", "Vị trí phải nằm trong lãnh thổ Việt Nam.");
    }
  };

  const getLocation = async () => {
    if (await requestLocationPermission()) {
      try {
        let { coords } = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setMarkerPosition({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        onSearchLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        onClose();
        // if (address.length > 0) {
        //   // setLocation(address[0].subregion + ", " + address[0].region);
        //   try {
        //     if (onSearchKeyChange) {
        //       // const parts = address[0].formattedAddress.split(",").slice(-4); // Tách chuỗi và lấy ba phần tử cuối cùng
        //       // const formattedAddress = parts.join(",").trim();
        //       onSearchKeyChange(
        //         address[0].subregion + ", " + address[0].region
        //         // formattedAddress
        //       );
        //     }
        //     onClose();
        //   } catch (error) {
        //     console.error("Failed to perform search:", error);
        //   }
        // }
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert(
          "Lỗi",
          "Chưa thể lấy được vị trí của người dùng, vui lòng thử lại sau!"
        );
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
        <View style={styles.mapContainer}>
          {region && (
            <MapView
              style={styles.map}
              provider={MapView.PROVIDER_GOOGLE}
              //   initialRegion={{
              //     latitude: markerPosition.latitude,
              //     longitude: markerPosition.longitude,
              //     latitudeDelta: 0.0922,
              //     longitudeDelta: 0.0421,
              //   }}
              //   region={{
              //     latitude: markerPosition.latitude,
              //     longitude: markerPosition.longitude,
              //     latitudeDelta: 0.0922,
              //     longitudeDelta: 0.0421,
              //   }}
              initialRegion={region}
              onPress={handleMapPress}
            >
              {markerPosition && (
                <Marker
                  coordinate={markerPosition} // Đặt vị trí ghim
                  title="Vị trí đánh dấu"
                  draggable // Cho phép kéo ghim
                  onDragEnd={(e) => setMarkerPosition(e.nativeEvent.coordinate)} // Cập nhật vị trí ghim khi kéo
                />
              )}
            </MapView>
          )}
          <Text style={styles.modalTextTitle}>Tìm kiếm theo vị trí</Text>
          {/* <View style={styles.searchContainer}>
            <Ionicons
              style={styles.searchIcon}
              name="location"
              size={24}
              color="black"
            />
            <GooglePlacesAutocomplete
              placeholder="Nhập vị trí?"
              textInputProps={{
                value: searchKey,
                onChangeText: (text) => {
                  setSearchKey(text);
                },
              }}
              onPress={handleSearch}
              query={{
                key: GOOGLE_API_KEY,
                language: "vi", // Ngôn ngữ tìm kiếm
                components: "country:vn", // Giới hạn tìm kiếm chỉ trong Việt Nam
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
          </View> */}
          <TouchableOpacity style={styles.locationBtn} onPress={getLocation}>
            <Ionicons style={styles.text} name="locate" size={24} color="red" />
            <Text style={styles.text}>Lấy vị trí hiện tại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.locationBtn2}
            onPress={handleManualSearch}
          >
            <Ionicons style={styles.text} name="locate" size={24} color="red" />
            <Text style={styles.text}>Lấy vị trí bạn chọn</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={onClose}
            style={styles.buttonCloseMapContainer}
          >
            <Text style={styles.buttonCloseMap}>Đóng</Text>
          </TouchableOpacity> */}
          {/* <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonMap}
                onPress={handleReturnToMarker}
              >
                <Text style={styles.buttonTextMap}>Vị trí salon/barber</Text>
              </TouchableOpacity>
            </View> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenModal: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // marginTop: 10,
    backgroundColor: COLORS.lightWhite,
    color: COLORS.lightWhite,
    // paddingHorizontal: 20,
  },
  mapContainer: {
    borderRadius: 10,
    width: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  buttonCloseMapContainer: {
    marginTop: SIZES.small,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    position: "absolute",
    borderRadius: SIZES.large,
    width: SIZES.width,
    zIndex: 999,
  },
  buttonCloseMap: {
    // position: "absolute",
    // top: 0,
    // right: 10,
    backgroundColor: COLORS.primary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: "bold",
    color: COLORS.lightWhite,
  },
  buttonMap: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  buttonTextMap: {
    color: COLORS.black,
    textAlign: "center",
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginHorizontal: SIZES.xSmall,
    padding: 5,
    // height: 50,
    position: "absolute",
    top: 35,
    zIndex: 999,
  },
  searchIcon: {
    color: "gray",
    paddingVertical: 7,
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
  modalTextTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10,
    fontSize: SIZES.medium,
    position: "absolute",
    top: 10,
    zIndex: 999,
  },
  locationBtn: {
    // width: "100%",
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 10,
    position: "absolute",
    bottom: 10,
    right: 5,
    zIndex: 999,
    marginHorizontal: SIZES.xSmall,
  },
  locationBtn2: {
    // width: "100%",
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 10,
    position: "absolute",
    bottom: 60,
    right: 5,
    zIndex: 999,
    marginHorizontal: SIZES.xSmall,
  },
  text: {
    color: COLORS.lightWhite,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SearchMapModal;
