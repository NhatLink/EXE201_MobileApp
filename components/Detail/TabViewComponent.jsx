import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS, SIZES, images } from "../../constants";
import Service from "./Service";
import Review from "./Review";
import About from "./About";
import ImageInWork from "./ImageInWork";
const initialLayout = { width: Dimensions.get("window").width };

// const DịchVụ = ({ storeId }) => (
//   <View style={[styles.scene, { backgroundColor: "#ff4081" }]}>
//     <Service storeId={storeId} />
//   </View>
// );

// const ĐánhGiá = ({ storeId }) => (
//   <View style={[styles.scene, { backgroundColor: "#673ab7" }]}>
//     <Review storeId={storeId} />
//   </View>
// );

const HìnhẢnh = () => (
  <View style={[styles.scene, { backgroundColor: "#2196f3" }]}>
    <Text>Hình ảnh</Text>
  </View>
);

// const ChiTiết = ({ storeId }) => (
//   <View style={[styles.scene, { backgroundColor: "#32cd32" }]}>
//     <About storeId={storeId} />
//   </View>
// );

const TabViewComponent = ({ storeId }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "dichvu", title: "Dịch Vụ" },
    { key: "danhgia", title: "Đánh Giá" },
    { key: "hinhanh", title: "Hình Ảnh" },
    { key: "chitiet", title: "Chi Tiết" },
  ]);
  // console.log("storeId in tab", storeId);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "dichvu":
        return <Service storeId={storeId} />;
      case "danhgia":
        return <Review storeId={storeId} />;
      case "hinhanh":
        return <ImageInWork storeId={storeId} />;
      case "chitiet":
        return <About storeId={storeId} />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: COLORS.black }}
          style={styles.style}
          labelStyle={styles.labelStyle}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  style: { backgroundColor: COLORS.lightWhite },
  labelStyle: {
    color: COLORS.black,
    textTransform: "none",
    fontSize: SIZES.small,
  },
});

export default TabViewComponent;
