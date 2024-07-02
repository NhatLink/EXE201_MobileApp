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
import { COLORS, SIZES } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../../utils/helper";
import OrderTile from "../../components/orders/OrderTile";
import { StarRating } from "../../components";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedbackBySalonInformationId } from "../../store/salon/action";
const Review = (storeId) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { feedback, salonDetail } = useSelector((state) => state.SALON);
  console.log(feedback);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [selectedRating, setSelectedRating] = useState(null);

  const filterFeedbacksByRating = async (rating) => {
    setSelectedRating(rating);
    if (rating === null) {
      // setFilteredFeedbacks(dataFeedback);
      await dispatch(
        fetchFeedbackBySalonInformationId(
          storeId.storeId,
          currentPage,
          itemsPerPage
        )
      );
    } else {
      // setFilteredFeedbacks(
      //   dataFeedback.filter((feedback) => feedback.rating === rating)
      // );
      await dispatch(
        fetchFeedbackBySalonInformationId(
          storeId.storeId,
          currentPage,
          itemsPerPage,
          rating
        )
      );
    }
  };
  //   if (loading) {
  //     return (
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="large" color={COLORS.primary} />
  //       </View>
  //     );
  //   }
  const Decrease = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const Increase = () => {
    if (currentPage < feedback?.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableOpacity style={styles.feedbackHeader}>
        <Text style={styles.feedbackTitle}>Feedback</Text>
      </TouchableOpacity> */}

      <View style={styles.ratingContainer}>
        <StarRating
          rating={salonDetail?.totalRating > 0 ? salonDetail?.totalRating : 0}
        />
        <Text style={styles.averageRatingText}>
          {salonDetail?.rate > 0
            ? (salonDetail?.rate).toFixed(1) + "/5.0"
            : "No ratings"}
        </Text>
        <Text style={styles.totalFeedbackText}>
          {salonDetail?.totalReviewer > 0
            ? "(" + salonDetail?.totalReviewer + " lượt đánh giá)"
            : "(0 lượt đánh giá)"}
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => filterFeedbacksByRating(null)}
          >
            <View style={styles.filterContent}>
              <FontAwesome name="star" size={SIZES.small} color="gold" />
              <Text style={styles.filterText}>Tất cả</Text>
            </View>
          </TouchableOpacity>
          {[5, 4, 3, 2, 1].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.filterButton,
                selectedRating === rating && styles.selectedFilterButton,
              ]}
              onPress={() => filterFeedbacksByRating(rating)}
            >
              <View style={styles.filterContent}>
                <FontAwesome name="star" size={16} color="gold" />
                <Text style={styles.filterText}>{rating} Sao</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.feedbackSection}>
        <Text style={styles.totalFeedbackText}>
          Lượt đánh giá: {feedback?.items?.length}
        </Text>
        {feedback?.items?.length > 0 ? (
          feedback?.items?.map((feedback, index) => (
            <View key={index} style={styles.feedback}>
              <View style={styles.reviewContainer}>
                <View style={styles.imageContainer}>
                  {/* Check spelling here if it's really `imageContanner` */}
                  <Image
                    source={{ uri: feedback?.customer?.img }}
                    style={styles.image}
                  />
                </View>
                <View style={styles.avatarContainer}>
                  <Text style={styles.author}>
                    {feedback?.customer?.fullName}
                  </Text>
                  <Text style={styles.date}>
                    {feedback?.createDate.split("T")[0]} -{" "}
                    {feedback?.createDate.split("T")[1].split(".")[0]}
                  </Text>
                </View>
              </View>
              <Text style={styles.author}>
                Dịch vụ đã dùng:{" "}
                {feedback?.appointment?.appointmentDetails?.length > 0
                  ? feedback.appointment.appointmentDetails
                      .map((detail) => detail.serviceName)
                      .join(", ")
                  : "Không có dịch vụ nào"}
              </Text>

              <StarRating rating={feedback?.rating} />
              <Text style={styles.feedbackText}>{feedback?.comment}</Text>
              <View horizontal style={styles.imageContainerService}>
                {feedback?.fileFeedbacks?.map((image, index) => (
                  <View key={index} style={styles.imageWrapperService}>
                    <Image
                      source={{ uri: image.img }}
                      style={styles.imageService}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.author}>
            Không có đánh giá {selectedRating} sao nào
          </Text>
          //   <Image
          //     source={{
          //       uri: "https://cdni.iconscout.com/illustration/premium/thumb/no-comment-10929763-8779479.png",
          //     }}
          //     style={styles.imageNotFound}
          //   />
        )}
      </View>
      <View style={styles.paging}>
        {currentPage > 1 && (
          <TouchableOpacity style={styles.pagingArrow} onPress={Decrease}>
            <Ionicons
              name="arrow-back-circle-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.pagingArrow}>{feedback?.page}</Text>
        {currentPage < feedback?.totalPages && (
          <TouchableOpacity style={styles.pagingArrow} onPress={Increase}>
            <Ionicons
              name="arrow-forward-circle-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.lightWhite,
    position: "relative",
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "left",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 10,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  feedbackSection: {
    marginTop: SIZES.small,
    paddingHorizontal: SIZES.medium,
  },
  feedbackName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: "10px",
  },
  feedback: {
    marginBottom: 10,
    padding: 10,
    // borderWidth: 1,
    // borderColor: "#ccc",
    // borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  totalFeedbackText: {
    fontSize: SIZES.small,
    fontWeight: "bold",
  },
  feedbackText: {
    fontSize: 14,
    color: "#666",
  },
  author: {
    fontSize: SIZES.small,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 3,
  },
  date: {
    fontSize: SIZES.xSmall,
    color: "#666",
    marginBottom: 5,
  },
  icon: { position: "absolute", top: 10, right: 10 },
  filtersContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: COLORS.lightWhite,
    paddingHorizontal: SIZES.medium,
  },

  filterButton: {
    padding: 10,
    marginRight: 5,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 5,
    backgroundColor: COLORS.lightWhite,
  },

  selectedFilterButton: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary,
  },

  filterContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  filterText: {
    marginLeft: 5,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: SIZES.xSmall,
  },
  ratingContainer: {
    backgroundColor: COLORS.lightWhite,
    paddingHorizontal: SIZES.medium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  averageRatingText: {
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: SIZES.small,
  },
  reviewContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  avatarContainer: {
    // flexDirection: "column",
    // justifyContent: "flex-start",
    // alignItems: "center",
    // paddingBottom: SIZES.xSmall,
  },
  imageContanner: {
    // alignItems: "center",
    // marginRight: SIZES.small,
    // flexDirection: "column",
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 40,
    overflow: "hidden",
    marginRight: SIZES.small,
  },
  imageContainerService: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 10,
  },
  imageWrapperService: {
    position: "relative",
    marginRight: 10,
  },
  imageService: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  paging: {
    // position: "absolute",
    // bottom: 0,
    // right: "50%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pagingArrow: {
    // marginVertical: 10,
    padding: 10,
  },
});
