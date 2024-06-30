import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import ButtonCustom from "../auth/Button";
import { COLORS, SIZES } from "../../constants";
import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  AntDesign,
  Ionicons,
} from "react-native-vector-icons";
import { Feather } from "@expo/vector-icons";

const CancelAppointmentModal = ({ isVisible, onClose, OnCancel }) => {
  const [modalVisible, setModalVisible] = useState(false);
  //   const [dataSent, setDataSent] = useState(data);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const reportOptions = [
    "Thay đổi lịch trình.",
    "Sự cố bất ngờ.",
    "Không hài lòng với dịch vụ trước đó.",
    "Tìm được dịch vụ khác.",
    "Quên lịch hẹn.",
    "Vấn đề tài chính.",
    "Tình trạng tóc không phù hợp.",
  ];
  //   const handleReason = (reason) => {
  //     let dataSubmit = {
  //       ...data,
  //       ReasonReport: reason,
  //     };
  //     setDataSent(dataSubmit);
  //     setModalVisible(true);
  //     console.log("data 1", dataSubmit);
  //   };

  const handlePress = async () => {
    // await dispatch(resetCheckOtp());
    if (!reason) {
      setReasonError("Lý do không được để trống");
      return;
    }
    if (reason.length < 5) {
      setReasonError("Lý do phải nhiều hơn 5 kí tự");
      return;
    }
    if (reason.length > 200) {
      setReasonError("Lý do không được hơn 200 kí tự");
      return;
    }
    setReasonError("");
    OnCancel(reason);
    onClose();
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
          <Text style={styles.modalTitle}>Hủy lịch hẹn</Text>
          <View style={styles.line} />
          <Text style={styles.modalText}>Hãy nhập lý do bên dưới</Text>
          <Text style={styles.modalSubText}>
            Hãy đưa ra lý do cụ thể giúp các salon và barber có thể cải thiện
            dịch vụ của mình nhé
          </Text>
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
                style={styles.searchInput}
                value={reason}
                placeholder="Lý do hủy lịch hẹn?"
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
          {reasonError ? (
            <Text style={{ color: "red", marginTop: 5, marginHorizontal: 20 }}>
              {reasonError}
            </Text>
          ) : null}
          <TouchableOpacity onPress={handlePress}>
            <Text style={styles.button}>Xác nhận hủy</Text>
          </TouchableOpacity>
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
  line: {
    padding: 1,
    backgroundColor: COLORS.gray2,
    marginVertical: 10,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.offwhite,
    borderRadius: SIZES.small,
    marginTop: SIZES.xxLarge,
    height: 50,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  searchWrapper: {
    flex: 1,
    marginRight: SIZES.xSmall,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.small,
    height: "100%",
  },
  searchInput: {
    fontFamily: "regular",
    color: COLORS.black,
    width: "100%",
    height: "100%",
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
});

export default CancelAppointmentModal;
