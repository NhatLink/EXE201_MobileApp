import React from "react";
import { View, Image, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { COLORS } from "../constants";

const CustomMarker = ({ coordinate, image, title, description }) => {
  return (
    <Marker coordinate={coordinate} title={title} description={description}>
      <View style={styles.markerContainer}>
        <Image source={{ uri: image }} style={styles.markerImage} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: 25,
    overflow: "hidden",
  },
  markerImage: {
    width: 40,
    height: 40,
  },
});

export default CustomMarker;
