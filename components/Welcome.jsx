import { useState } from "react";
import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLORS, SIZES } from "../constants";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <View>
      <View>
        <View style={styles.container}>
          <Image
            style={{ height: 80, width: 300, marginTop: 10 }}
            source={require("../assets/HairHubHome1.png")}
            resizeMode="contain" // hoặc "cover" hoặc "stretch" tùy theo yêu cầu của bạn
          />
          {/* <Text style={styles.welcomeTxt}>HairHub</Text> */}
          <Text style={styles.welcomeMessage}>
            Đặt Lịch mọi Lúc - Phục Vụ Mọi Nơi
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity>
          <Feather
            style={styles.searchIcon}
            name="search"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value=""
            onPressIn={() => navigation.navigate("Search")}
            placeholder="Bạn đang tìm gì?"
          />
        </View>

        {/* <TouchableOpacity style={styles.searchBtn} onPress={() => {}}>
          <Ionicons
            name="camera-outline"
            size={SIZES.xLarge}
            color={COLORS.offwhite}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeTxt: {
    fontFamily: "bold",
    fontSize: SIZES.xxLarge - 5,
    color: COLORS.black,
    marginTop: SIZES.xSmall,
  },
  welcomeMessage: {
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.secondary,
    marginBottom: SIZES.xSmall,
  },

  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.cardcolor,
    borderRadius: SIZES.medium,
    height: 50,
  },

  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.cardcolor,
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.small,
    height: "100%",
  },
  searchInput: {
    fontFamily: "regular",
    width: "100%",
    height: "100%",
    // paddingHorizontal: SIZES.medium,
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
    marginRight: 10,
    marginLeft: 10,
    color: "gray",
  },

  tabsContainer: {
    width: "100%",
    marginTop: SIZES.medium,
  },
  tab: (activeJobType, item) => ({
    paddingVertical: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    borderColor: activeJobType === item ? COLORS.secondary : COLORS.gray2,
  }),
  tabText: (activeJobType, item) => ({
    fontFamily: "medium",
    color: activeJobType === item ? COLORS.secondary : COLORS.gray2,
  }),
});
