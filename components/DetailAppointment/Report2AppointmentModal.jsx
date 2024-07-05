import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import ButtonCustom from "../auth/Button";
import { COLORS, SIZES } from "../../constants";
import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  AntDesign,
  Ionicons,
} from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";
import { CreateReport } from "../../store/report/action";
import { useDispatch } from "react-redux";
import Loader from "../auth/Loader";

const Report2AppointmentModal = ({
  isVisible,
  onClose,
  onCloseReport,
  data,
}) => {
  const dispatch = useDispatch();
  const [selectedImages, setSelectedImages] = useState([]);
  const [loader, setLoader] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //   allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImages((prev) => [...prev, result.assets[0].uri].slice(0, 3));
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImages((prev) => [...prev, result.assets[0].uri].slice(0, 3));
    }
  };

  const removeImage = (uri) => {
    setSelectedImages((prev) => prev.filter((image) => image !== uri));
  };

  const createReport = async () => {
    setLoader(true);
    try {
      let formData = new FormData();
      let dataSubmit = {
        ...data,
        ImgeReportRequest: selectedImages,
      };
      console.log("CreateReport:", dataSubmit);

      for (let key in dataSubmit) {
        if (key === "ImgeReportRequest") {
          dataSubmit[key].forEach((imageUri, index) => {
            const uriParts = imageUri.split(".");
            const fileType = uriParts[uriParts.length - 1];

            formData.append(key, {
              uri: imageUri,
              name: `image${index}.${fileType}`,
              type: `image/${fileType}`,
            });
          });
        } else {
          formData.append(key, dataSubmit[key]);
        }
      }

      console.log("CreateReport formData:", formData);
      await dispatch(CreateReport(formData));
    } catch (error) {
      console.error("CreateReport error:", error);
      Alert.alert("Error", "Oops, something went wrong. Try again");
    } finally {
      setLoader(false);
      onClose();
      onCloseReport();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenModal}>
        <View style={styles.modalContent}>
          <Loader visible={loader} />
          <Text style={styles.modalTitle}>Báo cáo Salon / Barber</Text>
          <View style={styles.line} />
          <Text style={styles.modalText}>Bước 2: Đưa bằng chứng</Text>
          <Text style={styles.modalSubText}>
            {`Bạn hãy chụp ảnh hay đăng ảnh phù hợp với lý do <${data?.ReasonReport}>`}
          </Text>
          <View style={styles.line} />
          {selectedImages.length < 3 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonleft} onPress={takePhoto}>
                {/* <Ionicons name="camera" size={30} color={COLORS.gray2} /> */}
                <Text style={styles.buttonText}>Chụp ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonrright} onPress={pickImage}>
                {/* <Ionicons name="camera" size={30} color={COLORS.gray2} /> */}
                <Text style={styles.buttonText}>Chọn ảnh</Text>
              </TouchableOpacity>
            </View>
          )}

          <View horizontal style={styles.imageContainer}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(image)}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={25}
                    color={COLORS.red}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {selectedImages.length > 0 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={createReport}>
                {/* <Ionicons name="camera" size={30} color={COLORS.gray2} /> */}
                <Text style={styles.buttonText}>Nộp báo cáo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    flex: 1,
    marginTop: 100,
    justifyContent: "flex-start",
    // alignItems: "flex-start",
    backgroundColor: "#f5f5f5",
    marginTop: 100,
    borderWidth: 2,
    borderColor: COLORS.gray2,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 18,
    textAlign: "left",
    marginHorizontal: 5,
    fontWeight: "bold",
  },
  modalSubText: {
    fontSize: 14,
    textAlign: "left",
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  buttonrright: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderLeftWidth: 0.5,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonleft: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    borderWidth: 2,
    borderRightWidth: 0.5,
    borderColor: COLORS.primary,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.black,
    fontSize: 15,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
  },
  line: {
    padding: 1,
    backgroundColor: COLORS.gray2,
    marginVertical: 10,
  },
});

export default Report2AppointmentModal;
