import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, ActivityIndicator } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { COLORS } from "../constants";

const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Kiểm tra kết nối internet ban đầu
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });

    // Lắng nghe sự thay đổi kết nối mạng
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Hủy bỏ lắng nghe khi component unmount
    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {children}
      <Modal visible={!isConnected} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Mất kết nối internet</Text>
            <ActivityIndicator size="large" color={COLORS.secondary} />
            <Text style={styles.modalText}>
              Vui lòng kiểm tra lại kết nối của bạn.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
});

export default NetworkProvider;
