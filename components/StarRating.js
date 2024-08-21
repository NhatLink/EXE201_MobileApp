import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Make sure to install expo-vector-icons
import { SIZES } from "../constants";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FontAwesome
        name={i <= rating ? "star" : "star-o"}
        size={SIZES.small}
        color="#bf9456"
        key={i}
      />
    );
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

export default StarRating;
