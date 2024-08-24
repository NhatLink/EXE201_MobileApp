import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import ButtonCustom from "../auth/Button";
import { COLORS, SIZES } from "../../constants";
import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  AntDesign,
  Ionicons,
} from "react-native-vector-icons";
import Report2AppointmentModal from "./Report2AppointmentModal";

const ReportAppointmentModal = ({ isVisible, onClose, data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSent, setDataSent] = useState(data);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const reportOptions = [
    "Không hài lòng với kết quả cắt tóc.",
    "Không đúng với mong đợi.",
    "Thái độ phục vụ của nhân viên.",
    "Thời gian chờ đợi quá lâu.",
    "Giá cả không phù hợp.",
    "Thông tin không chính xác.",
  ];
  const handleReason = (reason) => {
    let dataSubmit = {
      ...data,
      ReasonReport: reason,
    };
    setDataSent(dataSubmit);
    setModalVisible(true);
    console.log("data 1", dataSubmit);
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
          <Text style={styles.modalTitle}>Báo cáo Salon / Barber</Text>
          <View style={styles.line} />
          <Text style={styles.modalText}>Bước 1: Hãy chọn vấn đề</Text>
          <Text style={styles.modalSubText}>
            Nếu bạn có bất cứ vấn đề nào thì hãy báo cáo với chúng tôi, mọi báo
            cáo sẽ không công khai cho chủ doanh nghiệp
          </Text>
          <View style={styles.line} />

          {/* Danh sách các mục lựa chọn */}
          <ScrollView style={styles.menuWrapper}>
            {reportOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  handleReason(option);
                }}
              >
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemText}>{option}</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={30}
                    color={COLORS.gray2}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <Report2AppointmentModal
        isVisible={modalVisible}
        onClose={toggleModal}
        onCloseReport={onClose}
        data={dataSent}
      />
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
    backgroundColor: COLORS.cardcolor,
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
  menuWrapper: {
    width: "auto",
    // marginHorizontal: 10,
    // backgroundColor: COLORS.offwhite,
  },
  menuItem: {
    width: SIZES.width - 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    // paddingHorizontal: 30,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 0.5,
  },
  menuItemText: {
    fontFamily: "regular",
    color: COLORS.gray,
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 26,
  },
  line: {
    padding: 1,
    backgroundColor: COLORS.gray2,
    marginVertical: 10,
  },
});

export default ReportAppointmentModal;
