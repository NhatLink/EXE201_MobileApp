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
const Review = (storeId) => {
  const navigation = useNavigation();
  const services = [
    {
      reviewerName: "Nguyễn Văn A",
      reviewerAvatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOf4hNCvGeBVpxK7iCqSmGHQv6SKimx8CIpg&s",
      reviewDate: "2024-05-01",
      rating: 5,
      serviceUsed: "Shaving",
      review: "Very satisfied with the service, friendly staff.",
    },
    {
      reviewerName: "Trần Thị B",
      reviewerAvatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOf4hNCvGeBVpxK7iCqSmGHQv6SKimx8CIpg&s",
      reviewDate: "2024-04-20",
      rating: 4,
      serviceUsed: "Hair Care",
      review: "Good service but a bit of a wait.",
    },
  ];
  const [filteredFeedbacks, setFilteredFeedbacks] = useState(services);
  const [dataFeedback, setDataFeedback] = useState(services);
  const [selectedRating, setSelectedRating] = useState(null);
  const filterFeedbacksByRating = (rating) => {
    setSelectedRating(rating);
    if (rating === null) {
      setFilteredFeedbacks(dataFeedback);
    } else {
      setFilteredFeedbacks(
        dataFeedback.filter((feedback) => feedback.rating === rating)
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
  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableOpacity style={styles.feedbackHeader}>
        <Text style={styles.feedbackTitle}>Feedback</Text>
      </TouchableOpacity> */}

      <View style={styles.ratingContainer}>
        <StarRating
          rating={
            dataFeedback?.length > 0
              ? dataFeedback?.reduce((acc, curr) => acc + curr.rating, 0) /
                dataFeedback?.length
              : 0
          }
        />
        <Text style={styles.averageRatingText}>
          {dataFeedback?.length > 0
            ? (
                dataFeedback?.reduce((acc, curr) => acc + curr.rating, 0) /
                dataFeedback?.length
              ).toFixed(1) + "/5.0"
            : "No ratings"}
        </Text>
        <Text style={styles.totalFeedbackText}>
          {dataFeedback?.length > 0
            ? "(" + dataFeedback?.length + " lượt đánh giá)"
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
          Lượt đánh giá: {filteredFeedbacks?.length}
        </Text>
        {filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((feedback, index) => (
            <View key={index} style={styles.feedback}>
              <View style={styles.reviewContainer}>
                <View style={styles.imageContainer}>
                  {/* Check spelling here if it's really `imageContanner` */}
                  <Image
                    source={{ uri: feedback.reviewerAvatar }}
                    style={styles.image}
                  />
                </View>
                <View style={styles.avatarContainer}>
                  <Text style={styles.author}>{feedback?.reviewerName}</Text>
                  <Text style={styles.date}>
                    {formatDate(feedback?.reviewDate)}
                  </Text>
                </View>
              </View>
              <Text style={styles.author}>
                Dịch vụ đã dùng: {feedback?.serviceUsed}
              </Text>
              <StarRating rating={feedback?.rating} />
              <Text style={styles.feedbackText}>{feedback?.review}</Text>
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
    marginVertical: SIZES.small,
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
    paddingBottom: SIZES.xSmall,
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
});
