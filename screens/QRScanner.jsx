import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { CameraView, Camera } from "expo-camera/next";
import { Ionicons } from "@expo/vector-icons";
import { checkInByUser } from "../store/user/action";
import Button from "../components/auth/Button";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../constants";
export default function QRScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dataScan, setDataScan] = useState(null);
  const { checkInStatus, checkInData, accountId, user } = useSelector(
    (state) => state.USER
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (dataScan) {
        setLoader(true);
        // const accountId = await SecureStore.getItemAsync("accountId");
        // const userInfoJson = await SecureStore.getItemAsync("userInfo");
        // let userInfo = null;
        // if (userInfoJson) {
        //   try {
        //     userInfo = JSON.parse(userInfoJson);
        //   } catch (error) {
        //     console.error("Error parsing userInfo", error);
        //   }
        // }
        const data = {
          customerId: user?.id,
          dataString: dataScan,
        };
        if (dataScan && accountId && user && user?.id) {
          await dispatch(checkInByUser(accountId, data));
        }
        setLoader(false);
      }
    }

    fetchData();
  }, [dataScan, dispatch]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setDataScan(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (loader) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (checkInStatus) {
    return (
      <View style={styles.container}>
        <Modal
          // visible={checkInStatus}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Check in thành công</Text>
              <Ionicons
                name="checkmark-circle-outline"
                size={150}
                color={COLORS.primary}
              />
              <Text style={styles.modalText}>
                Chúc bạn tận hưởng dịch vụ vui vẻ
              </Text>

              <View style={styles.containerInfo}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Text style={styles.button1}>Đóng</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={CheckIn}>
                  <Text style={styles.button1}>Check In</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonContainer1}>
            <Button
              title={"Chạm để quét QR lần nữa"}
              onPress={() => setScanned(false)}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer1: {
    width: 300,
    flexDirection: "column",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
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
  containerInfo: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5,
  },
  button1: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: "bold",
    color: COLORS.lightWhite,
  },
});
