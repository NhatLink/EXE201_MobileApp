import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
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
import { Rating } from "react-native-ratings";
import { Feather } from "@expo/vector-icons";
import { CreateFeedback } from "../../store/feedback/action";

const FeedbackAppointmentModal = ({ isVisible, onClose, data, services }) => {
  const dispatch = useDispatch();
  const [selectedImages, setSelectedImages] = useState([]);
  const [loader, setLoader] = useState(false);
  const [ratingFeedback, setRatingFeedback] = useState(0);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [errorStar, setErrorStart] = useState("");
  const [feedbackDetails, setFeedbackDetails] = useState(
    services.map((item) => ({
      AppointmentDetailId: item?.id,
      Rating: 0, // Giá trị mặc định
    }))
  );

  const handleRatingChange = (rating, itemDetailId) => {
    setFeedbackDetails((prevFeedbackDetails) =>
      prevFeedbackDetails.map((detail) =>
        detail.AppointmentDetailId === itemDetailId
          ? { ...detail, Rating: rating }
          : detail
      )
    );
  };

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

  const createFeedback = async () => {
    const hasInvalidRating = feedbackDetails.some(
      (detail) => detail.Rating === 0
    );

    if (hasInvalidRating) {
      setErrorStart("Vui lòng đánh giá tất cả các dịch vụ."); // Cập nhật thông báo lỗi
      return;
    }
    if (!reason) {
      setReasonError("Lý do không được để trống");
      return;
    }
    if (reason.length < 5) {
      setReasonError("Lý do phải nhiều hơn 5 kí tự");
      return;
    }
    if (reason.length > 200) {
      setReasonError("Lý do không được hơn 250 kí tự");
      return;
    }
    // if (ratingFeedback === 0) {
    //   setErrorStart("Số sao đánh giá không bằng 0");
    //   return;
    // }
    setLoader(true);
    if (!data || !data.SalonId || !data.CustomerId || !data.AppointmentId) {
      console.error("Thiếu dữ liệu bắt buộc trong data.");
      return;
    }
    try {
      let formData = new FormData();
      let dataSubmit = {
        ...data,
        FeedbackDetailRequests: feedbackDetails,
        // Rating: ratingFeedback,
        Comment: reason,
        ImgFeedbacks: selectedImages,
      };
      // console.log("CreateFeedback:", dataSubmit);

      for (let key in dataSubmit) {
        if (key === "ImgFeedbacks") {
          if (dataSubmit.ImgFeedbacks.length > 0) {
            dataSubmit.ImgFeedbacks.forEach((imageUri, index) => {
              const uriParts = imageUri.split(".");
              const fileType = uriParts[uriParts.length - 1];
              formData.append("ImgFeedbacks", {
                uri: imageUri,
                name: `image${index}.${fileType}`,
                type: `image/${fileType}`,
              });
            });
          }
        } else if (key === "FeedbackDetailRequests") {
          // Thay vì chuỗi JSON, gửi từng phần tử của mảng
          dataSubmit[key].forEach((item, index) => {
            formData.append(
              `FeedbackDetailRequests[${index}][AppointmentDetailId]`,
              item.AppointmentDetailId
            );
            formData.append(
              `FeedbackDetailRequests[${index}][Rating]`,
              item.Rating
            );
          });
        } else {
          // Các trường thông thường khác
          formData.append(key, dataSubmit[key]);
        }
      }

      console.log("CreateFeedback formData:", formData);
      console.log("CreateFeedback dataSubmit:", dataSubmit);
      await dispatch(CreateFeedback(formData, data.AppointmentId));
    } catch (error) {
      console.error("CreateFeedback error:", error);
      Alert.alert("Error", "Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setLoader(false);
      onClose();
      setReasonError("");
      setErrorStart("");
      setSelectedImages([]);
      setRatingFeedback(0);
      setReason("");
      setFeedbackDetails(
        services.map((item) => ({
          AppointmentDetailId: item?.id,
          Rating: 0, // Giá trị mặc định
        }))
      );
    }
  };

  if (false) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <ScrollView style={styles.fullScreenModal}>
          <View style={styles.modalContent}>
            <Loader visible={loader} />
            <Text style={styles.modalTitle}>Đánh giá lịch hẹn</Text>
            <View style={styles.line} />
            <Text style={styles.modalText}>Hãy điền các thông tin đầy đủ</Text>
            <Text style={styles.modalSubText}>
              Hãy đánh giá công tâm và những lời khuyên hữu ích để salon /
              barber cải thiện chất lượng dịch vụ
            </Text>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Loader visible={loader} />
      <ScrollView style={styles.fullScreenModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Đánh giá lịch hẹn</Text>
          <View style={styles.line} />
          <Text style={styles.modalText}>Hãy điền các thông tin đầy đủ</Text>
          <Text style={styles.modalSubText}>
            Hãy đánh giá công tâm và những lời khuyên hữu ích để salon / barber
            cải thiện chất lượng dịch vụ
          </Text>
          <View style={styles.line} />
          <Text style={styles.modalText}>Số sao đánh giá:</Text>
          <View style={styles.line} />
          {services?.map((itemDetail) => {
            const feedbackDetail = feedbackDetails.find(
              (detail) => detail.AppointmentDetailId === itemDetail?.id
            );

            return (
              <View key={itemDetail?.id}>
                <View style={styles.serviceItem}>
                  <Image
                    source={{ uri: itemDetail?.imgServiceHair }}
                    style={styles.productImage}
                  />
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName} numberOfLines={1}>
                      {itemDetail?.serviceName}{" "}
                      {`(${itemDetail?.timeServiceHair * 60} Phút)`}
                    </Text>
                    <Text style={styles.serviceDescription} numberOfLines={1}>
                      {`${itemDetail?.startTime?.split("T")[1]} đến ${
                        itemDetail?.endTime?.split("T")[1]
                      } `}
                    </Text>
                  </View>
                  <View style={styles.pricingInfo}>
                    <Text style={styles.servicePrice} numberOfLines={1}>
                      {`${itemDetail?.priceServiceHair?.toLocaleString()} VND`}
                    </Text>
                    <View style={styles.containerInfo}>
                      <Text style={styles.titleService}>
                        {itemDetail?.salonEmployee?.fullName}
                      </Text>
                      <Image
                        source={{ uri: itemDetail?.salonEmployee?.img }}
                        resizeMode="cover"
                        style={styles.avatar}
                      />
                    </View>
                  </View>
                </View>
                <Rating
                  ratingCount={5}
                  imageSize={30}
                  startingValue={feedbackDetail?.Rating || 0} // Lấy giá trị từ feedbackDetails
                  tintColor={COLORS.cardcolor}
                  onFinishRating={(rating) =>
                    handleRatingChange(rating, itemDetail?.id)
                  }
                />
              </View>
            );
          })}

          {errorStar ? (
            <Text style={{ color: "red", marginTop: 5, marginHorizontal: 20 }}>
              {errorStar}
            </Text>
          ) : null}
          <Text style={styles.modalText}>Nhận xét:</Text>
          <View style={styles.line} />
          <View style={styles.searchContainer}>
            <TouchableOpacity>
              <Feather
                style={styles.searchIcon}
                name="alert-circle"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <View style={styles.searchWrapper}>
              <TextInput
                editable
                style={styles.searchInput}
                value={reason}
                multiline
                numberOfLines={4}
                maxLength={250}
                placeholder="Lời đánh giá?"
                onChangeText={(text) => {
                  setReason(text);
                  setReasonError(""); // Clear error when user starts typing
                }}
              />
            </View>
            {reason && (
              <TouchableOpacity onPress={() => setReason("")}>
                <Ionicons
                  style={styles.deleteIcon}
                  name="close-circle-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              marginBottom: SIZES.large,
            }}
          >
            {reasonError ? (
              <Text
                style={{
                  color: "red",
                  marginTop: 5,
                  marginHorizontal: 20,
                }}
              >
                {reasonError}
              </Text>
            ) : null}
          </View>

          <Text style={styles.modalText}>
            {`Ảnh đánh giá (Có thể để trống)`}{" "}
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
          {/* {selectedImages.length > 0 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} >
               
                <Text style={styles.buttonText}>Nộp báo cáo</Text>
              </TouchableOpacity>
            </View>
          )} */}
          <View style={styles.submitButton}>
            <ButtonCustom title={"Gửi nhận xét"} onPress={createFeedback} />
          </View>
        </View>
      </ScrollView>
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
    justifyContent: "flex-start",
    // alignItems: "flex-start",
    backgroundColor: COLORS.cardcolor,
    marginTop: 120,
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
    marginVertical: 20,
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
  //   button: {
  //     flexDirection: "row",
  //     justifyContent: "center",
  //     alignContent: "center",
  //     textAlign: "center",
  //     backgroundColor: COLORS.secondary,
  //     padding: 10,
  //     borderRadius: 15,
  //     borderWidth: 2,
  //     borderColor: COLORS.primary,
  //   },
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
  searchContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: COLORS.offwhite,
    borderRadius: SIZES.small,
    marginTop: SIZES.large,
    height: 150,
    paddingVertical: 5,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  searchWrapper: {
    flex: 1,
    marginRight: SIZES.xSmall,
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    borderRadius: SIZES.small,
    // height: "100%",
  },
  searchInput: {
    fontWeight: "normal",
    color: COLORS.black,
    paddingHorizontal: SIZES.xSmall,
  },
  searchIcon: {
    marginLeft: 10,
    color: "gray",
  },
  deleteIcon: {
    // position: "absolute",
    // top: 12,
    // right: 10,
    marginRight: 5,
    color: "gray",
  },
  button: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: "bold",
  },
  submitButton: {
    // position: "relative",
    // bottom: 5,
    width: SIZES.width - 40,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#f5f5f5",
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 5,
    marginHorizontal: SIZES.xSmall,
  },
  serviceInfo: {
    flex: 5, // 7 parts
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-around",
  },
  pricingInfo: {
    flex: 5, // 2 parts
    flexDirection: "column",
    alignItems: "flex-end", // Align text to right if needed
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 10,
  },
  serviceName: {
    fontSize: SIZES.small,
    fontWeight: "bold",
  },
  serviceDescription: {
    fontSize: SIZES.xSmall,
    marginTop: 5,
  },
  servicePrice: {
    fontSize: SIZES.xSmall,
    fontWeight: "bold",
  },
  servicePrice2: {
    fontSize: SIZES.xSmall,
    textDecorationLine: "line-through",
  },
  containerInfo: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5,
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 999,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  titleService: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: SIZES.small,
    marginHorizontal: 5,
  },
});

export default FeedbackAppointmentModal;
