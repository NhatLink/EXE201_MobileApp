// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import * as SplashScreen from "expo-splash-screen";
// import { useFonts } from "expo-font";
// import { useCallback } from "react";
// import BottomTabNavigation from "./navigation/BottomTabNavigation";
// import {
//   Cart,
//   Favorites,
//   Details,
//   Products,
//   LoginPage,
//   Signup,
//   Profile,
//   PaymentPage,
//   DetailOrder,
// } from "./screens";
// import Orders from "./screens/Orders";
// import { PaymentProvider } from "./hook/PaymentContext";
// import reportWebVitals from "./reportWebVitals";
// import { Provider } from "react-redux";
// import store from "./store";
// const Stack = createNativeStackNavigator();
// //we are going creates a native stack navigator  using the createNativeStackNavigator function.
// import Toast from "react-native-toast-message";
// // Defining the main App component
// export default function App() {
//   // Step One
//   // Loading custom fonts using the useFonts hook
//   const [fontsLoaded] = useFonts({
//     regular: require("./assets/fonts/Poppins-Regular.ttf"), // Loading a font file for regular style
//     light: require("./assets/fonts/Poppins-Light.ttf"), // Loading a font file for light style
//     bold: require("./assets/fonts/Poppins-Bold.ttf"), // Loading a font file for bold style
//     semibold: require("./assets/fonts/Poppins-SemiBold.ttf"), // Loading a font file for semi-bold style
//     medium: require("./assets/fonts/Poppins-Medium.ttf"), // Loading a font file for medium style
//     extrabold: require("./assets/fonts/Poppins-ExtraBold.ttf"), // Loading a font file for extra bold style
//   });
//   // Defining a callback function to be called when the root view layout changes
//   const onLayoutRootView = useCallback(async () => {
//     // Checking if the fonts have been loaded
//     if (fontsLoaded) {
//       // Hiding the splash screen asynchronously
//       await SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded]);

//   // If the fonts are not loaded yet
//   if (!fontsLoaded) {
//     // Return null to render nothing (possibly displaying a loading indicator)
//     return null;
//   }

//   returnr(
//     <Provider store={store}>
//       <PaymentProvider>
//         <NavigationContainer>
//           <Stack.Navigator>
//             <Stack.Screen
//               name="Bottom Navigation"
//               component={BottomTabNavigation}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Details"
//               component={Details}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Details-Order"
//               component={DetailOrder}
//               options={{ headerShown: false }}
//             />

//             <Stack.Screen
//               name="Cart"
//               component={Cart}
//               options={{ headerShown: false }}
//             />

//             <Stack.Screen
//               name="Orders"
//               component={Orders}
//               options={{ headerShown: false }}
//             />

//             <Stack.Screen
//               name="Login"
//               component={LoginPage}
//               options={{ headerShown: false }}
//             />

//             <Stack.Screen
//               name="Signup"
//               component={Signup}
//               options={{ headerShown: false }}
//             />

//             <Stack.Screen
//               name="New-Rivals"
//               component={Products}
//               options={{ headerShown: false }}
//             />

//             <Stack.Screen
//               name="Favorites"
//               component={Favorites}
//               options={{ headerShown: false }}
//             />

//             <Stack.Screen
//               name="Profile"
//               component={Profile}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="PaymentPage"
//               component={PaymentPage}
//               options={{ headerShown: false }}
//             />
//           </Stack.Navigator>
//           <Toast />
//         </NavigationContainer>
//       </PaymentProvider>
//     </Provider>
//   );
// }
// reportWebVitals();
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import BottomTabNavigation from "./navigation/BottomTabNavigation";
import {
  Cart,
  Favorites,
  Details,
  Products,
  LoginPage,
  Signup,
  Profile,
  PaymentPage,
  DetailOrder,
  History,
  Booking,
  DetailProfile,
  CheckEmail,
  DetailAppointmennt,
  QRScanner,
  Chat,
  Collection,
  DetailCollection,
  CheckNonExistEmail,
  ResetPassword,
} from "./screens";
import Orders from "./screens/Orders";
import { PaymentProvider } from "./hook/PaymentContext";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
import Toast from "react-native-toast-message";
import { FETCH_TOKEN_FAIL, fetchToken, fetchUser2 } from "./store/user/action";
import * as SecureStore from "expo-secure-store";
import { AppState, ToastAndroid } from "react-native";
import NetworkProvider from "./hook/NetworkProvider";
import { COLORS } from "./constants";
import { UserServices } from "./services/userServices";
const Stack = createNativeStackNavigator();
function RouterContent() {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   const handleUserFetch = async () => {
  //     console.log("fetchToken");
  //     try {
  //       const refreshToken = await SecureStore.getItemAsync("refreshToken");
  //       const accessToken = await SecureStore.getItemAsync("accessToken");

  //       console.log("old accessToken", accessToken);

  //       if (refreshToken) {
  //         await dispatch(fetchToken({ refreshToken: refreshToken }));
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy accessToken", error);
  //     }
  //   };

  //   handleUserFetch();
  // }, []);

  // useEffect(() => {
  //   const handleUserFetch = async () => {
  //     console.log("fetchToken2");
  //     try {
  //       const accessToken = await SecureStore.getItemAsync("accessToken");
  //       console.log("accessToken to fetchUser2", accessToken);
  //       if (accessToken) {
  //         await dispatch(fetchUser2(accessToken));
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy accessToken", error);
  //     }
  //   };

  //   handleUserFetch();
  // }, []);

  //   useEffect(() => {
  //     const handleUserFetch = async () => {
  //       console.log("fetchUser2");

  //       try {
  //         const accessToken = await SecureStore.getItemAsync("accessToken");

  //         if (accessToken) {
  //           await dispatch(fetchUser2(accessToken));
  //         }
  //       } catch (error) {
  //         console.error("Failed to fetch accessToken", error);
  //       }
  //     };

  //     const appStateSubscription = AppState.addEventListener(
  //       "change",
  //       (nextAppState) => {
  //         if (nextAppState === "active") {
  //           handleUserFetch();
  //         }
  //       }
  //     );

  //     handleUserFetch(); // Fetch user data when the app starts

  //     return () => {
  //       appStateSubscription.remove();
  //     };
  //   }, []);
  useEffect(() => {
    const fetchTokensAndUser = async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        const accessToken = await SecureStore.getItemAsync("accessToken");
        console.log("fetch token in app");
        // console.log("old accessToken", accessToken);
        // console.log("refreshToken to fetch", refreshToken);

        if (!refreshToken) {
          console.log("Refresh token không tồn tại");
          return; // Ngừng thực thi nếu không có refresh token
        }
        // Fetch a new access token using the refresh token
        const res = await UserServices.fetchToken({ refreshToken });
        const newAccessToken = res.data.accessToken;
        // console.log("new accessToken", newAccessToken);

        // Save the new access token
        await SecureStore.setItemAsync("accessToken", newAccessToken);

        // Fetch user data with the new access token
        await dispatch(fetchUser2(newAccessToken));
      } catch (err) {
        if (err.response && err.response.status === 400) {
          console.log("Refresh token expired");
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          await SecureStore.deleteItemAsync("userInfo");
          await SecureStore.deleteItemAsync("accountId");
          dispatch({
            type: FETCH_TOKEN_FAIL,
            payload: err.response.data,
          });
          ToastAndroid.show(
            "Phiên đăng nhập hết hạn !!! Vui lòng đăng nhập lại",
            ToastAndroid.SHORT
          );
        } else {
          console.log("Error fetching token or user data:", err);
          ToastAndroid.show(
            "Lỗi khi fetch dữ liệu người dùng!!!",
            ToastAndroid.SHORT
          );
        }
      }
    };
    fetchTokensAndUser();
  }, [dispatch]);

  useEffect(() => {
    const fetchTokensAndUser = async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        const accessToken = await SecureStore.getItemAsync("accessToken");
        console.log("fetch token loop");

        // console.log("old accessToken", accessToken);
        // console.log("refreshToken to fetch", refreshToken);

        // Kiểm tra xem refreshToken có tồn tại không
        if (!refreshToken) {
          console.log("Refresh token không tồn tại");
          ToastAndroid.show(
            "Refresh token không tồn tại. Vui lòng đăng nhập lại.",
            ToastAndroid.SHORT
          );
          return; // Ngừng thực thi nếu không có refresh token
        }

        // Fetch a new access token using the refresh token
        const res = await UserServices.fetchToken({ refreshToken });
        const newAccessToken = res.data.accessToken;
        // console.log("new accessToken", newAccessToken);

        // Save the new access token
        await SecureStore.setItemAsync("accessToken", newAccessToken);

        // Fetch user data with the new access token
        await dispatch(fetchUser2(newAccessToken));
      } catch (err) {
        if (err.response && err.response.status === 400) {
          console.log("Refresh token expired");
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          await SecureStore.deleteItemAsync("userInfo");
          await SecureStore.deleteItemAsync("accountId");
          dispatch({
            type: FETCH_TOKEN_FAIL,
            payload: err.response.data,
          });
          ToastAndroid.show(
            "Phiên đăng nhập hết hạn !!! Vui lòng đăng nhập lại",
            ToastAndroid.SHORT
          );
        } else {
          console.log("Error fetching token or user data:", err);
          ToastAndroid.show(
            "Lỗi khi fetch dữ liệu người dùng!!!",
            ToastAndroid.SHORT
          );
        }
      }
    };

    const intervalId = setInterval(fetchTokensAndUser, 480000); // 8 phút

    return () => clearInterval(intervalId);
  }, [dispatch]);
}

export default function App() {
  // useEffect(() => {
  //   const handleUserFetch = async () => {
  //     try {
  //       const dispatch = useDispatch();

  //       const accessToken = await SecureStore.getItemAsync("accessToken");

  //       if (accessToken) {
  //         await dispatch(fetchUser2(accessToken));
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch accessToken", error);
  //     }
  //   };

  //   const appStateSubscription = AppState.addEventListener(
  //     "change",
  //     (nextAppState) => {
  //       if (nextAppState === "active") {
  //         handleUserFetch();
  //       }
  //     }
  //   );

  //   handleUserFetch(); // Fetch user data when the app starts

  //   return () => {
  //     appStateSubscription.remove();
  //   };
  // }, []);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   const handleUserFetch = async () => {
  //     try {
  //       const accessToken = await SecureStore.getItemAsync("accessToken");

  //       if (accessToken) {
  //         await dispatch(fetchUser2(accessToken));
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy accessToken", error);
  //     }
  //   };

  //   handleUserFetch();
  // }, [dispatch]);
  const [fontsLoaded] = useFonts({
    regular: require("./assets/fonts/Poppins-Regular.ttf"),
    light: require("./assets/fonts/Poppins-Light.ttf"),
    bold: require("./assets/fonts/Poppins-Bold.ttf"),
    semibold: require("./assets/fonts/Poppins-SemiBold.ttf"),
    medium: require("./assets/fonts/Poppins-Medium.ttf"),
    extrabold: require("./assets/fonts/Poppins-ExtraBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NetworkProvider>
        <PaymentProvider>
          <RouterContent />
          <NavigationContainer onReady={onLayoutRootView}>
            <Stack.Navigator
              screenOptions={{
                cardStyle: { backgroundColor: "#f4f2eb" },
              }}
            >
              <Stack.Screen
                name="Bottom Navigation"
                component={BottomTabNavigation}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Details"
                component={Details}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Details-Order"
                component={DetailOrder}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Cart"
                component={Cart}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Orders"
                component={Orders}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Login"
                component={LoginPage}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="New-Rivals"
                component={Products}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Favorites"
                component={Favorites}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="History"
                component={History}
                options={{ headerShown: false }}
              />

              {/* <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false }}
            /> */}
              <Stack.Screen
                name="PaymentPage"
                component={PaymentPage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Booking"
                component={Booking}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="DetailProfile"
                component={DetailProfile}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CheckEmail"
                component={CheckEmail}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="DetailAppointment"
                component={DetailAppointmennt}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="QRScanner"
                component={QRScanner}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Chat"
                component={Chat}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Collection"
                component={Collection}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="DetailCollection"
                component={DetailCollection}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CheckNonExistEmail"
                component={CheckNonExistEmail}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ResetPassword"
                component={ResetPassword}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
            <Toast />
          </NavigationContainer>
          {/* </RouterContent> */}
        </PaymentProvider>
      </NetworkProvider>
    </Provider>
  );
}
