import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addService, setStoreId } from "../../store/bookingStore/action";
import { fetchServiceHairBySalonInformationId } from "../../store/salon/action";
const ListServiceModal = ({ isVisible, onClose }) => {
  const dispatch = useDispatch();
  const { storeId } = useSelector((state) => state.booking);
  const { salonService } = useSelector((state) => state.SALON);
  const { services } = useSelector((state) => state.booking);
  const handleBook = (item) => {
    dispatch(addService(item));
    // console.log("item", item);
    onClose();
  };
  const [uniqueServices, setUniqueServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    async function fetchData() {
      if (storeId) {
        try {
          setLoader(true);
          await dispatch(
            fetchServiceHairBySalonInformationId(
              storeId,
              currentPage,
              itemsPerPage
            )
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoader(false); // Tắt loading
        }
      }
    }
    fetchData();
  }, [storeId, currentPage, itemsPerPage]);

  // useEffect(() => {
  //   if (salonService?.items && services) {
  //     const checkedIds = new Set(services.map((service) => service.id));
  //     const filteredServices = salonService.items.filter(
  //       (service) => !checkedIds.has(service.id)
  //     );
  //     setUniqueServices(filteredServices);
  //   }
  // }, [salonService, services]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ScrollView style={{ backgroundColor: "#f4f2eb" }}>
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
          {/* {salonService && salonService?.items.length > 0 ? (
            salonService?.items?.map((item) => (
              <View
                key={item?.id}
                style={styles.serviceItem}
                onPress={() => {
                  // Handle navigation or other actions
                }}
              >
                <View style={styles.imgService}>
                  <Image source={{ uri: item?.img }} style={styles.image} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName} numberOfLines={1}>
                    {item?.serviceName}
                  </Text>
                  <Text style={styles.serviceDescription} numberOfLines={1}>
                    {item?.description}
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
                      >{`${item?.price?.toLocaleString()} VND`}</Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={styles.servicePrice}
                        numberOfLines={1}
                      >{`${item?.price?.toLocaleString()} VND`}</Text>
                    </>
                  )}

                  <Text style={styles.serviceDescription} numberOfLines={1}>{`${
                    item?.time * 60
                  } phút`}</Text>
                </View>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBook(item)}
                >
                  <Text style={styles.button}>Đặt</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View
              style={{
                borderTopWidth: 0.5,
                borderTopColor: COLORS.gray2,
                paddingVertical: 10,
                marginVertical: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: COLORS.gray2,
              }}
            >
              <Text style={styles.text}>Không còn dịch vụ nào nữa !!!</Text>
            </View>
          )} */}
          {salonService && salonService?.items.length > 0 ? (
            salonService?.items?.map((item) => {
              // Kiểm tra xem dịch vụ này đã được đặt chưa
              const isBooked = services.some(
                (service) => service.id === item.id
              );

              return (
                <View
                  key={item?.id}
                  style={styles.serviceItem}
                  onPress={() => {
                    // Handle navigation or other actions
                  }}
                >
                  <View style={styles.imgService}>
                    <Image source={{ uri: item?.img }} style={styles.image} />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName} numberOfLines={1}>
                      {item?.serviceName}
                    </Text>
                    <Text style={styles.serviceDescription} numberOfLines={1}>
                      {item?.description}
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
                        >{`${item?.price?.toLocaleString()} VND`}</Text>
                      </>
                    ) : (
                      <Text
                        style={styles.servicePrice}
                        numberOfLines={1}
                      >{`${item?.price?.toLocaleString()} VND`}</Text>
                    )}

                    <Text
                      style={styles.serviceDescription}
                      numberOfLines={1}
                    >{`${item?.time * 60} phút`}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => !isBooked && handleBook(item)} // Ngăn không cho đặt lại nếu đã đặt
                  >
                    {/* Hiển thị nút "Đặt" hoặc "Đã đặt" */}
                    <Text style={isBooked ? styles.Disbutton : styles.button}>
                      {isBooked ? "Đã đặt" : "Đặt"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View
              style={{
                borderTopWidth: 0.5,
                borderTopColor: COLORS.gray2,
                paddingVertical: 10,
                marginVertical: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: COLORS.gray2,
              }}
            >
              <Text style={styles.text}>Không còn dịch vụ nào nữa !!!</Text>
            </View>
          )}
          {salonService?.total > salonService?.size && (
            <TouchableOpacity onPress={() => setItemsPerPage(itemsPerPage + 4)}>
              {!loader ? (
                <Text style={styles.loadmoreButton}>
                  Hiện thị thêm dịch vụ{" "}
                </Text>
              ) : (
                <ActivityIndicator
                  style={{ marginVertical: 20 }}
                  size="large"
                  color={COLORS.secondary}
                />
              )}
            </TouchableOpacity>
          )}
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
    backgroundColor: COLORS.background,
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
  imgService: {
    flex: 2, // 1 part
    height: "100%",
    marginRight: 5,
  },
  serviceInfo: {
    flex: 5, // 7 parts
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
  image: {
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: SIZES.small,
  },
  button: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginLeft: 5,
    fontWeight: "bold",
  },
  Disbutton: {
    backgroundColor: COLORS.gray2,
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
  loadmoreButton: {
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    padding: 3,
    marginVertical: 20,
    marginHorizontal: 40,
    borderRadius: 10,
    fontWeight: "bold",
  },
});

export default ListServiceModal;
