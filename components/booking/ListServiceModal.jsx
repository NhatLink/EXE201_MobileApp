import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TextInput,
  ScrollView,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addService, setStoreId } from "../../store/bookingStore/action";
const ListServiceModal = ({ isVisible, onClose }) => {
  const services = [
    {
      service_id: 1,
      serviceName: "Basic Haircut",
      description: "Quick and suitable haircut for all ages.",
      price: 150000,
      reducePrice: 120000,
      serviceTime: 30,
      images: [
        {
          id: 1,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-tao-kieu-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 2,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-cat-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 3,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-duoi-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
      ],
    },
    {
      service_id: 2,
      serviceName: "Shaving",
      description: "Facial shave with a special razor, includes skin care.",
      price: 100000,
      serviceTime: 15,
      images: [
        {
          id: 1,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-tao-kieu-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 2,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-cat-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 3,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-duoi-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
      ],
    },
    {
      service_id: 3,
      serviceName: "Hair Coloring",
      description:
        "Hair dyeing with fashionable colors, protects hair and scalp.",
      price: 500000,
      reducePrice: 400000,
      serviceTime: 90,
      images: [
        {
          id: 1,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-tao-kieu-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 2,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-cat-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 3,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-duoi-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
      ],
    },
    {
      service_id: 4,
      serviceName: "Hair Care",
      description:
        "Thorough hair care service, includes wash, rinse, and head massage.",
      price: 200000,
      serviceTime: 45,
      images: [
        {
          id: 1,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-tao-kieu-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 2,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-cat-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 3,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-duoi-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
      ],
    },
    {
      service_id: 5,
      serviceName: "Hair Care1",
      description:
        "Thorough hair care service, includes wash, rinse, and head massage.",
      price: 200000,
      serviceTime: 45,
      images: [
        {
          id: 1,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-tao-kieu-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 2,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-cat-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 3,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-duoi-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
      ],
    },
    {
      service_id: 6,
      serviceName: "Hair Care2",
      description:
        "Thorough hair care service, includes wash, rinse, and head massage.",
      price: 200000,
      serviceTime: 45,
      images: [
        {
          id: 1,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-tao-kieu-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 2,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-cat-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 3,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-duoi-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
      ],
    },
    {
      service_id: 7,
      serviceName: "Hair Care3",
      description:
        "Thorough hair care service, includes wash, rinse, and head massage.",
      price: 200000,
      reducePrice: 100000,
      serviceTime: 45,
      images: [
        {
          id: 1,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-tao-kieu-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 2,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-cat-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
        {
          id: 3,
          src: "https://cdn.myspa.vn/file/myspa-cdn/myspa_blog/uploads/2021/08/Goi-duoi-toc-1024x642.jpg",
          uploadDate: "2024-05-01",
        },
      ],
    },
    {
      service_id: 8,
      serviceName: "Hair Care4",
      description:
        "Thorough hair care service, includes wash, rinse, and head massage.",
      price: 200000,
      serviceTime: 45,
    },
  ];
  const dispatch = useDispatch();
  const handleBook = (item) => {
    dispatch(addService(item));
    console.log("item", item);
    onClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ScrollView>
        <View style={styles.fullScreenModal}>
          <Text style={styles.modalTextTitle}>Thêm dịch vụ</Text>
          {/* <View style={styles.searchContainer}>
          <TouchableOpacity>
            <Ionicons
              style={styles.searchIcon}
              name="storefront"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              value={searchKey}
              onChangeText={setSearchKey}
              placeholder="Bạn đang tìm gì?"
            />
          </View>

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Ionicons
              name="search"
              size={SIZES.xLarge}
              color={COLORS.offwhite}
            />
          </TouchableOpacity>
        </View> */}
          <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
            {/* <Text style={styles.textStyle}>Close</Text> */}
            <Ionicons
              style={styles.textStyle}
              name="return-up-back"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          {services.map((item) => (
            <View
              key={item.service_id}
              style={styles.serviceItem}
              onPress={() => {
                // Handle navigation or other actions
              }}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName} numberOfLines={1}>
                  {item.serviceName}
                </Text>
                <Text style={styles.serviceDescription} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
              <View style={styles.pricingInfo}>
                {item?.reducePrice ? (
                  <>
                    <Text
                      style={styles.servicePrice}
                      numberOfLines={1}
                    >{`${item?.reducePrice?.toLocaleString()} VND`}</Text>
                    <Text
                      style={styles.servicePrice2}
                      numberOfLines={1}
                    >{`${item.price.toLocaleString()} VND`}</Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={styles.servicePrice}
                      numberOfLines={1}
                    >{`${item.price.toLocaleString()} VND`}</Text>
                  </>
                )}

                <Text
                  style={styles.serviceDescription}
                  numberOfLines={1}
                >{`${item.serviceTime} phút`}</Text>
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBook(item)}
              >
                <Text style={styles.button}>Book</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenModal: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: COLORS.lightWhite,
    color: COLORS.lightWhite,
    paddingHorizontal: 20,
  },
  modalTextTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10,
    fontSize: SIZES.medium,
  },
  buttonClose: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingLeft: 10,
  },
  textStyle: {
    color: COLORS.black,
    fontWeight: "bold",
    textAlign: "center",
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 5,
    // marginHorizontal: SIZES.xSmall,
  },
  serviceInfo: {
    flex: 6, // 7 parts
    flexDirection: "column",
  },
  pricingInfo: {
    flex: 2, // 2 parts
    flexDirection: "column",
    alignItems: "flex-end", // Align text to right if needed
  },
  bookButton: {
    flex: 2, // 1 part
  },
  button: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginLeft: 5,
    fontWeight: "bold",
  },
  serviceName: {
    fontSize: SIZES.small,
    fontWeight: "bold",
  },
  serviceDescription: {
    fontSize: SIZES.xSmall,
  },
  servicePrice: {
    fontSize: SIZES.xSmall,
    fontWeight: "bold",
  },
  servicePrice2: {
    fontSize: SIZES.xSmall,
    textDecorationLine: "line-through",
  },
});

export default ListServiceModal;
