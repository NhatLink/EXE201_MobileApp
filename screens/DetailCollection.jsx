import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ToastAndroid,
  Modal,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { COLORS, SIZES, SHADOWS } from "../constants";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import AddPictureCollection from "../components/Collection/AddPictureCollection";
import UpdateInfoCollectionModal from "../components/Collection/UpdateInfoCollectionModal";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/auth/Loader";
import { UpdateCustomerImageHistory } from "../store/collection/action";
const DetailCollection = ({ navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { collectionId, nameCollection, imgCollection } = route.params;
  // const selectedImages = [
  //   "https://m.yodycdn.com/blog/cac-kieu-uon-toc-nu-yody-vn.jpg",
  //   "https://media.vneconomy.vn/images/upload/2021/04/21/1-1605855863607646708689.jpg",
  //   "https://lavo.com.vn/wp-content/uploads/2021/11/f3c63023bd013c4668bf45d4a92cdde4-min.jpg",
  //   "https://gcs.tripi.vn/public-tripi/tripi-feed/img/473668Seo/kieu-toc-dai-xoan-gon-song-1008270.jpg",
  //   "https://images2.thanhnien.vn/528068263637045248/2023/11/1/kieu-toc-hime-20-16988370729041030195237.jpg",
  //   "https://japana.vn/uploads/detail/2021/09/images/mai-toc-dep-duoc-xem-la-trang-suc-long-lay-nhat-cua-phu-nu-01.jpg",
  // ];

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);
  const [isSelectionMode, setSelectionMode] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [title, setTitle] = useState(nameCollection?.title);
  const [loader, setLoader] = useState(false);

  // const [notes, setNotes] = useState(nameCollection?.note);
  const [selectedImages, setSelectedImages] = useState(
    imgCollection.map((image) => image.urlImage)
  );
  // const selectedImages = imgCollection.map((image) => image.urlImage);
  const { collection, loading } = useSelector((state) => state.COLLECTION);
  const { user } = useSelector((state) => state.USER);

  useEffect(() => {
    // Tìm kiếm khi data hoặc idToFind thay đổi
    const result = collection?.items?.find((item) => item.id === collectionId);
    if (result) {
      setTitle(result.title);
    } else {
      setTitle("");
    }
  }, [collection, collectionId]);

  useEffect(() => {
    const foundItem = collection?.items?.find(
      (item) => item.id === collectionId
    );
    if (foundItem) {
      const imageUrls = foundItem.imageStyles.map((image) => image.urlImage);
      setSelectedImages(imageUrls);
    } else {
      setSelectedImages([]);
    }
  }, [collectionId, collection]);

  const openImageModal = (image) => {
    if (!isSelectionMode) {
      setSelectedImage(image);
      setModalVisible(true);
    } else {
      toggleSelectImage(image);
    }
  };

  const openAddImageModal = () => {
    if (!isSelectionMode) {
      setModalVisible1(true);
    }
  };

  const openInfoModal = () => {
    if (!isSelectionMode) {
      setModalVisible2(true);
    }
  };

  const toggleSelectImage = (image) => {
    if (selectedForDeletion.includes(image)) {
      setSelectedForDeletion(
        selectedForDeletion.filter((selected) => selected !== image)
      );
    } else {
      setSelectedForDeletion([...selectedForDeletion, image]);
    }
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const handleLongPress = (image) => {
    setSelectionMode(true);
    toggleSelectImage(image);
  };

  const deleteConfirm = () => {
    if (selectedForDeletion.length === selectedImages.length) {
      // Alert.alert("Lỗi", "Vui lòng chọn ít nhất một hình ảnh");
      ToastAndroid.show(
        "Bộ sưu tập phải có ít nhất một hình ảnh",
        ToastAndroid.SHORT
      );
      return;
    }
    Alert.alert(
      `Xóa ${selectedForDeletion.length} ảnh`,
      "Bạn chắc chắn muốn xóa?",
      [
        { text: "Đóng", onPress: () => console.log("Cancel pressed") },
        {
          text: "Tiếp tục xóa",
          onPress: () => {
            handleDelete();
          },
        },
      ],
      { defaultIndex: 1 } // Index 1 corresponds to the "Delete" button
    );
  };

  const handleDelete = async () => {
    // Thực hiện xóa ảnh hoặc các xử lý khác
    setLoader(true);
    const idsToDelete = imgCollection
      .filter((img) => selectedForDeletion.includes(img.urlImage))
      .map((img) => img.id);
    try {
      let dataSubmit = {
        RemoveImageStyleIds: idsToDelete,
      };

      if (user && user.id && collectionId) {
        await dispatch(
          UpdateCustomerImageHistory(collectionId, dataSubmit, user.id)
        );
      } else {
        ToastAndroid.show(
          "Có lỗi xảy ra, vui lòng thử lại sau",
          ToastAndroid.SHORT
        );
        return;
      }
    } catch (error) {
      Alert.alert("Lỗi", "Oops, có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setLoader(false);
      setSelectedForDeletion([]);
      setSelectionMode(false);
    }
  };

  const handleCancel = () => {
    setSelectedForDeletion([]);
    setSelectionMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loader} />
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          Kho lưu trữ {title}
        </Text>
      </View>
      {!isSelectionMode && (
        <TouchableOpacity
          style={styles.newCollection}
          onPress={() => openInfoModal()}
        >
          <Text>+ Chỉnh sửa thông tin bộ sưu tập</Text>
        </TouchableOpacity>
      )}
      <View style={styles.imageContainer}>
        {selectedImages.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageWrapper}
            onPress={() => openImageModal(image)}
            onLongPress={() => handleLongPress(image)}
          >
            <Image source={{ uri: image }} style={styles.image} />
            {isSelectionMode && (
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  selectedForDeletion.includes(image) && styles.selected,
                ]}
                onPress={() => toggleSelectImage(image)}
              >
                <Ionicons
                  name={
                    selectedForDeletion.includes(image)
                      ? "checkbox-outline"
                      : "square-outline"
                  }
                  size={25}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
        {!isSelectionMode && selectedImages.length < 10 && (
          <TouchableOpacity
            style={styles.serviceButton}
            onPress={() => openAddImageModal()}
          >
            <Ionicons name="add-outline" size={20} color={COLORS.black} />
            <Ionicons name="image-outline" size={30} color={COLORS.black} />
          </TouchableOpacity>
        )}
      </View>

      {/* {isSelectionMode && selectedForDeletion.length > 0 && (
        <Button title="Xóa ảnh" onPress={handleDelete} />
      )}
      {isSelectionMode && <Button title="Hủy xóa" onPress={handleCancel} />} */}
      {isSelectionMode && (
        <View style={styles.bottomTab}>
          {isSelectionMode && selectedForDeletion.length > 0 && (
            <TouchableOpacity onPress={deleteConfirm} style={styles.button}>
              <Ionicons name="trash-outline" size={20} color={COLORS.black} />
              <Text>Xóa ảnh</Text>
            </TouchableOpacity>
          )}
          {isSelectionMode && (
            <TouchableOpacity onPress={handleCancel} style={styles.button}>
              <Ionicons
                name="reload-circle-outline"
                size={20}
                color={COLORS.black}
              />
              <Text>Hủy xóa</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={closeImageModal}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={30} color={COLORS.secondary} />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullscreenImage}
          />
        </View>
      </Modal>
      <AddPictureCollection
        isVisible={modalVisible1}
        onClose={() => {
          setModalVisible1(!modalVisible1);
        }}
        data={{
          length: selectedImages?.length,
          id: collectionId,
        }}
      />
      <UpdateInfoCollectionModal
        isVisible={modalVisible2}
        onClose={() => {
          setModalVisible2(!modalVisible2);
        }}
        data={{
          id: collectionId,
          Title: nameCollection?.title,
          Description: nameCollection?.note,
        }}
      />
    </SafeAreaView>
  );
};

export default DetailCollection;

const styles = StyleSheet.create({
  container: {
    // marginTop: 20,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: COLORS.background,
  },
  upperRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SIZES.width - 50,
    marginVertical: SIZES.xSmall,
  },
  newCollection: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SIZES.width - 50,
    marginVertical: SIZES.xSmall,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    marginLeft: 5,
    marginRight: 10,
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
  serviceButton: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "dashed",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    marginBottom: 10,
    width: "30%",
    height: SIZES.width / 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  button: {
    backgroundColor: COLORS.cardcolor,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: COLORS.background,
    // borderRadius: 10,
    padding: 10,
  },
  fullscreenImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  selectButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  selected: {
    backgroundColor: COLORS.red,
    borderRadius: 5,
  },
  bottomTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: COLORS.secondary,
    // borderTopWidth: 1,
    // borderColor: COLORS.gray,
  },
});
