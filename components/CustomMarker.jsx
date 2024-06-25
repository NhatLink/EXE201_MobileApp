import React from "react";
import { View, Image, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const CustomMarker = ({ coordinate, image, title }) => {
  return (
    <Marker coordinate={coordinate} title={title}>
      <View style={styles.markerContainer}>
        <Image source={{ uri: image }} style={styles.markerImage} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 25,
    overflow: "hidden",
  },
  markerImage: {
    width: 50,
    height: 50,
  },
});

export default CustomMarker;
