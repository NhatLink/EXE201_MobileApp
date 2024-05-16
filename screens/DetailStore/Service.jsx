import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Button,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, images } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../../utils/helper";
import OrderTile from "../../components/orders/OrderTile";
import { SliderBox } from "react-native-image-slider-box";
const Service = (storeId) => {
  const navigation = useNavigation();
  const services = [
    {
      serviceName: "Basic Haircut",
      description: "Quick and suitable haircut for all ages.",
      price: 150000,
      reducePrice: 120000,
      serviceTime: "30 minutes",
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
      serviceName: "Shaving",
      description: "Facial shave with a special razor, includes skin care.",
      price: 100000,
      serviceTime: "15 minutes",
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
      serviceName: "Hair Coloring",
      description:
        "Hair dyeing with fashionable colors, protects hair and scalp.",
      price: 500000,
      reducePrice: 400000,
      serviceTime: "90 minutes",
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
      serviceName: "Hair Care",
      description:
        "Thorough hair care service, includes wash, rinse, and head massage.",
      price: 200000,
      serviceTime: "45 minutes",
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
      serviceName: "Hair Care1",
      description:
        "Thorough hair care service, includes wash, rinse, and head massage.",
      price: 200000,
      serviceTime: "45 minutes",
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
      serviceName: "Hair Care2",
      description:
        "Thorough hair care service, includes wash, rinse, and head massage.",
      price: 200000,
      serviceTime: "45 minutes",
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
      serviceName: "Hair Care3",
      description:
        "Thorough hair care service, includes wash, rinse, and head massage.",
      price: 200000,
      reducePrice: 100000,
      serviceTime: "45 minutes",
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
      serviceName: "Hair Care4",
      description:
        "Thorough hair care service, includes wash, rinse, and head massage.",
      price: 200000,
      serviceTime: "45 minutes",
    },
  ];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const getImageUrls = (images) => {
    return images.map((image) => image.src);
  };

  const openModal = (service) => {
    setSelectedService({
      ...service,
      images: getImageUrls(service.images),
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedService(null);
  };
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View>
  //         {services.map((item) => (
  //           <TouchableOpacity
  //             key={item.serviceName}
  //             style={styles.serviceItem}
  //             onPress={() => {
  //               // Handle navigation or other actions
  //             }}
  //           >
  //             <Text style={styles.serviceName}>{item.serviceName}</Text>
  //             <Text style={styles.serviceDescription}>{item.description}</Text>
  //             <Text
  //               style={styles.servicePrice}
  //             >{`Price: ${item.price.toLocaleString()} VND`}</Text>
  //             <Text>{`Duration: ${item.serviceTime}`}</Text>
  //           </TouchableOpacity>
  //         ))}
  //       </View>
  //     </SafeAreaView>
  //   );
  // };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {services.map((item) => (
          <View
            key={item.serviceName}
            style={styles.serviceItem}
            onPress={() => {
              // Handle navigation or other actions
            }}
          >
            <TouchableOpacity
              style={styles.serviceInfo}
              onPress={() => openModal(item)}
            >
              <Text style={styles.serviceName} numberOfLines={1}>
                {item.serviceName}
              </Text>
              <Text style={styles.serviceDescription} numberOfLines={1}>
                {item.description}
              </Text>
            </TouchableOpacity>
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
              >{`${item.serviceTime}`}</Text>
            </View>
            <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
              <Text style={styles.button}>Book</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false} // Set transparent to false to use the full screen
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.fullScreenModal}>
          <Text style={styles.modalTextTitle}>
            {selectedService?.serviceName}
          </Text>
          {selectedService?.images && (
            <View style={styles.carouselContainer}>
              <SliderBox
                images={selectedService?.images}
                dotColor={COLORS.primary}
                inactiveDotColor={COLORS.secondary}
                ImageComponentStyle={{
                  borderRadius: 15,
                  width: "93%",
                  marginBottom: 10,
                }}
                autoplay
                circleLoop
              />
            </View>
          )}
          <Text style={styles.modalText}>{selectedService?.description}</Text>
        </View>
        <TouchableOpacity style={styles.buttonClose} onPress={closeModal}>
          <Text style={styles.textStyle}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Service;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.lightWhite,
    position: "relative",
  },
  upperRow: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SIZES.width - 50,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontFamily: "bold",
    fontWeight: "500",
    letterSpacing: 2,
    paddingTop: SIZES.small,
    // paddingLeft: SIZES.xLarge,
    marginBottom: SIZES.xSmall,
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
  fullScreenModal: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 35,
    backgroundColor: COLORS.lightWhite,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    marginLeft: 10,
    fontSize: SIZES.small,
  },
  modalTextTitle: {
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
    marginLeft: 10,
    fontSize: SIZES.medium,
  },
  buttonClose: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
  },
  textStyle: {
    color: COLORS.black,
    fontWeight: "bold",
    textAlign: "center",
  },
  carouselContainer: {
    marginBottom: 10,
    height: "28%",
    alignItems: "center",
  },
});
