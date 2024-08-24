import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Service from "./Service";
import Review from "./Review";
import About from "./About";
import { COLORS } from "../../constants";
import Employee from "./Employee";

const TabViewComponent = ({ storeId }) => {
  const [selectedTab, setSelectedTab] = useState("Dịch Vụ");

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Dịch Vụ":
        return <Service storeId={storeId} />;
      case "Nhân Viên":
        return <Employee storeId={storeId} />;
      case "Đánh Giá":
        return <Review storeId={storeId} />;
      case "Chi Tiết":
        return <About storeId={storeId} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        {["Dịch Vụ", "Nhân Viên", "Đánh Giá", "Chi Tiết"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterButton,
              selectedTab === tab && styles.selectedFilterButton,
            ]}
            onPress={() => handleTabChange(tab)}
          >
            <View style={styles.filterContent}>
              {/* <FontAwesome name="star" size={16} color="gold" /> */}
              <Text style={styles.filterText}>{tab}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.scene}>
        <View
          style={selectedTab === "Dịch Vụ" ? styles.visible : styles.hidden}
        >
          <Service storeId={storeId} />
        </View>
        <View
          style={selectedTab === "Nhân Viên" ? styles.visible : styles.hidden}
        >
          <Employee storeId={storeId} />
        </View>
        <View
          style={selectedTab === "Đánh Giá" ? styles.visible : styles.hidden}
        >
          <Review storeId={storeId} />
        </View>
        <View
          style={selectedTab === "Chi Tiết" ? styles.visible : styles.hidden}
        >
          <About storeId={storeId} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scene: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Dàn đều các nút tab
    paddingVertical: 5,
    backgroundColor: COLORS.background,
  },
  filterButton: {
    flex: 1, // Chia đều không gian giữa các nút tab
    padding: 10,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 5,
    backgroundColor: COLORS.background,
    alignItems: "center", // Căn giữa nội dung bên trong nút tab
  },
  selectedFilterButton: {
    borderBottomWidth: 1,
    borderColor: COLORS.secondary,
  },
  filterContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    marginLeft: 5,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  visible: {
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
  },
  hidden: {
    display: "none",
  },
});

export default TabViewComponent;
