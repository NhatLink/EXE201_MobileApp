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
  Alert,
  ToastAndroid,
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

const UpdateInfoCollectionModal = ({ isVisible, onClose, data }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState(data?.title);
  const [notes, setNotes] = useState(data?.note);
  const [titleError, setTitleError] = useState("");
  const [notesError, setNotesError] = useState("");

  const createCollection = () => {
    if (!title) {
      setTitleError("Tiêu đề không được để trống");
      return;
    }
    if (!title.length > 50) {
      setTitleError("Tiêu đề không được quá 50 kí tự");
      return;
    }
    if (!notes) {
      setNotesError("Ghi chú không được để trống");
      return;
    }
    if (notes.length > 300) {
      setNotesError("Ghi chú không được quá 300 kí tự");
      return;
    }
    // Lưu logic cho việc tạo bộ sưu tập ở đây...
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ScrollView style={styles.fullScreenModal}>
        <Loader visible={loader} />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chỉnh sửa thông tin bộ sưu tập</Text>
          <View style={styles.line} />

          <Text style={styles.modalText}>Tiêu đề:</Text>
          <View style={styles.searchContainerTitle}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                style={styles.searchIcon}
                name="folder"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <View style={styles.searchWrapper}>
              <TextInput
                style={styles.searchInput}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  setTitleError("");
                }}
                placeholder="Tiêu đề bộ sưu tập"
              />
            </View>
            {title && (
              <TouchableOpacity onPress={() => setTitle("")}>
                <Ionicons
                  style={styles.deleteIcon}
                  name="close-circle-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>
          {titleError ? (
            <Text style={{ color: "red", marginLeft: 20 }}>{titleError}</Text>
          ) : null}

          <Text style={styles.modalText}>Ghi chú:</Text>
          <View style={styles.searchContainer}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                style={styles.searchIcon}
                name="note-edit"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <View style={styles.searchWrapper}>
              <TextInput
                style={styles.searchInput}
                value={notes}
                onChangeText={(text) => {
                  setNotes(text);
                  setNotesError("");
                }}
                multiline
                maxLength={300}
                placeholder="Ghi chú bộ sưu tập"
              />
            </View>
            {notes && (
              <TouchableOpacity onPress={() => setNotes("")}>
                <Ionicons
                  style={styles.deleteIcon}
                  name="close-circle-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>
          {notesError ? (
            <Text style={{ color: "red", marginLeft: 20 }}>{notesError}</Text>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.submitButton}>
        <ButtonCustom
          title={"Cập nhật bộ sưu tập"}
          onPress={createCollection}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenModal: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalContent: {
    flex: 1,
    justifyContent: "flex-start",
    // alignItems: "flex-start",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray2,
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
    flexWrap: "wrap", // Cho phép các hình ảnh tự động xuống dòng khi quá 3 tấm
    justifyContent: "flex-start", // Căn các ảnh về đầu hàng
    alignItems: "center",
    marginVertical: 10,
  },
  imageWrapper: {
    position: "relative",
    marginHorizontal: 5,
    marginBottom: 10, // Thêm khoảng cách giữa các hàng
    width: "30%", // Đặt chiều rộng cho mỗi hình ảnh để chia đều trong 3 hàng
  },
  image: {
    width: "100%", // Đảm bảo hình ảnh chiếm hết chiều rộng của imageWrapper
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
    backgroundColor: COLORS.cardcolor,
    borderRadius: SIZES.small,
    height: 150,
    paddingVertical: 5,
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  searchContainerTitle: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: COLORS.cardcolor,
    borderRadius: SIZES.small,
    marginVertical: 10,
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
    position: "absolute",
    bottom: 5,
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
});

export default UpdateInfoCollectionModal;
