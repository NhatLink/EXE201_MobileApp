import { View, StyleSheet } from "react-native";
import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import { COLORS, SIZES } from "../constants";

const Carousel = () => {
  const slides = [
    "https://easysalon.vn/wp-content/uploads/2020/02/thiet-ke-barbershop-1.jpg",
    "https://img1.wsimg.com/isteam/ip/fa580673-4d55-49a6-b6ee-63b20b123179/IMG_1069%20(1).JPG",
    "https://4rau.vn/upload/hinhanh/z4459651436951_8aa378d5040dea1cb3dc505a03d1ca50-6729.jpg",
  ];
  return (
    <View style={styles.carouselContainer}>
      <SliderBox
        images={slides}
        dotColor={COLORS.primary}
        inactiveDotColor={COLORS.secondary}
        ImageComponentStyle={{ borderRadius: 15, width: "93%", marginTop: 15 }}
        autoplay
        circleLoop
      />
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    alignItems: "center",
  },
});
