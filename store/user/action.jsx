import { ToastAndroid } from "react-native";
import { UserServices } from "../../services/userServices";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAppointmentByAccountId,
  GetAppointmentByHistoryCustomerId,
} from "../appointment/action";
// import { useNavigation } from "@react-navigation/native";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAIL = "FETCH_USER_FAIL";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const FORGOT_PASS_SUCCESS = "FORGOT_PASS_SUCCESS";
export const FORGOT_PASS_FAIL = "FORGOT_PASS_FAIL";
export const GET_USER_BY_ID = "GET_USER_BY_ID";
export const UPDATE_USER_BY_ID = "UPDATE_USER_BY_ID";
export const FETCH_TOKEN_SUCCESS = "FETCH_TOKEN_SUCCESS";
export const FETCH_TOKEN_FAIL = "FETCH_TOKEN_FAIL";
export const CHECK_IN_REQUEST = "CHECK_IN_REQUEST";
export const CHECK_IN_SUCCESS = "CHECK_IN_SUCCESS";
export const CHECK_IN_FAILURE = "CHECK_IN_FAILURE";
export const RESET_CHECK_IN_STATUS = "RESET_CHECK_IN_STATUS";
// Login action
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await UserServices.loginUser(credentials);
    if (response.data.roleName === "Customer") {
      dispatch({ type: LOGIN_SUCCESS, payload: response.data });
      dispatch(fetchUser(response.data.accessToken));
      // Save to SecureStore
      SecureStore.setItemAsync("accessToken", response.data.accessToken);
      SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
      SecureStore.setItemAsync("accountId", response.data.accountId);
      SecureStore.setItemAsync(
        "userInfo",
        JSON.stringify(response.data.customerResponse)
      );
      ToastAndroid.show("đăng nhập thành công", ToastAndroid.SHORT);
    } else {
      console.log("Tài khoản của bạn không thể đăng nhập");
      ToastAndroid.show(
        "Tài khoản của bạn không thể đăng nhập vào app dành cho khách hàng",
        ToastAndroid.SHORT
      );
    }
  } catch (error) {
    console.log("eroor login:", error);
    dispatch({ type: LOGIN_FAIL, payload: error.response.data });
    ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
  }
};

// Fetch user action
export const fetchToken = (data) => async (dispatch) => {
  console.log("fetchTokendata", data);

  try {
    const response = await UserServices.fetchToken(data);
    console.log("accessToken new", response.data.accessToken);

    SecureStore.setItemAsync("accessToken", response.data.accessToken);
    SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
    dispatch({ type: FETCH_TOKEN_SUCCESS, payload: response.data });
  } catch (error) {
    if (error.response.status === 400) {
      console.log("Refresh token expired");
      dispatch({
        type: FETCH_TOKEN_FAIL,
        payload: error.response.data,
      });
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("userInfo");
      await SecureStore.deleteItemAsync("accountId");
    } else {
      console.error("fetchToken failed", error);
    }
  }
};

// Logout action
export const logoutUser = (credentials) => async (dispatch) => {
  try {
    const response = await UserServices.logoutUser(credentials);
    ToastAndroid.show(response.data, ToastAndroid.SHORT);
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export const registerUser = (data, navigation) => async (dispatch) => {
  // const navigation = useNavigation();
  try {
    const response = await UserServices.registerUser(data);
    dispatch({ type: REGISTER_SUCCESS, payload: response.data });
    ToastAndroid.show("Đăng kí thành công", ToastAndroid.SHORT);
    navigation.navigate("Profile");
  } catch (error) {
    dispatch({ type: REGISTER_FAIL, payload: error.response.data });
  }
};

export const forgotPassword = (data, navigation) => async (dispatch) => {
  // const navigation = useNavigation();
  try {
    const response = await UserServices.forgotPassword(data);
    dispatch({ type: FORGOT_PASS_SUCCESS, payload: response.data });
    ToastAndroid.show(
      "Thay đổi mật khẩu thành công! Vui lòng đăng nhập lại",
      ToastAndroid.SHORT
    );
    navigation.navigate("Profile");
  } catch (error) {
    dispatch({ type: FORGOT_PASS_FAIL, payload: error.response.data });
    ToastAndroid.show(
      "Thay đổi mật khẩu thất bại! Vui lòng thử lại sau",
      ToastAndroid.SHORT
    );
  }
};

export const getUserById = (id) => async (dispatch) => {
  try {
    const response = await UserServices.getUserById(id);
    dispatch({ type: GET_USER_BY_ID, payload: response.data });
    SecureStore.setItemAsync("userInfo", JSON.stringify(response.data));
  } catch (error) {
    console.error("Get user by id error:", error);
  }
};

export const updateUserById = (id, data) => async (dispatch) => {
  try {
    const response = await UserServices.updateUserById(id, data);
    dispatch(getUserById(id));
    // SecureStore.setItemAsync("userInfo", JSON.stringify(response.data));
    ToastAndroid.show(response.data, ToastAndroid.SHORT);
  } catch (error) {
    console.log("Update user by id error:", error);
    const errorMessage = error.response?.data?.message || error.message;
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
  }
};

export const updatePasswordUserById = (id, data) => async (dispatch) => {
  try {
    const response = await UserServices.updatePasswordUserById(id, data);
    dispatch(getUserById(id));
    // SecureStore.setItemAsync("userInfo", JSON.stringify(response.data));
    ToastAndroid.show(response.data, ToastAndroid.SHORT);
  } catch (error) {
    console.log("update Password User By Id error:", error);
    const errorMessage = error.response?.data?.message || error.message;
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
  }
};

export const fetchUser = (accessToken) => async (dispatch) => {
  try {
    const response = await UserServices.fetchUser(accessToken);
    SecureStore.setItemAsync("accountId", response.data.accountId);
    SecureStore.setItemAsync(
      "userInfo",
      JSON.stringify(response.data.customerResponse)
    );
    dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
  } catch (error) {
    if (error.response.status === 401) {
      // accessToken expired, try to refresh it
      try {
        console.log("Access token expired");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        const refreshResponse = await UserServices.fetchToken(refreshToken);
        SecureStore.setItemAsync(
          "accessToken",
          refreshResponse.data.accessToken
        );
        SecureStore.setItemAsync(
          "refreshToken",
          refreshResponse.data.refreshToken
        );
        dispatch({ type: FETCH_TOKEN_SUCCESS, payload: refreshResponse.data });
        // retry fetching user with new accessToken
        const retryResponse = await UserServices.fetchUser(
          refreshResponse.data.accessToken
        );
        dispatch({ type: FETCH_USER_SUCCESS, payload: retryResponse.data });
      } catch (refreshError) {
        if (refreshError.response.status === 400) {
          console.log("Refresh token expired");
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          await SecureStore.deleteItemAsync("userInfo");
          await SecureStore.deleteItemAsync("accountId");
          dispatch({
            type: FETCH_TOKEN_FAIL,
            payload: refreshError.response.data,
          });
        }
      }
    } else {
      dispatch({ type: FETCH_USER_FAIL, payload: error.response.data });
    }
  }
};

export const fetchUser2 = (accessToken) => async (dispatch, getState) => {
  try {
    // const { accessToken } = getState().USER;
    // const refreshToken = await SecureStore.getItemAsync("refreshToken");
    // await dispatch(fetchToken({ refreshToken: refreshToken }));
    const response = await UserServices.fetchUser(accessToken);
    SecureStore.setItemAsync("accountId", response.data.accountId);
    SecureStore.setItemAsync(
      "userInfo",
      JSON.stringify(response.data.customerResponse)
    );
    dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
    // ToastAndroid.show("Chào mừng trở lại", ToastAndroid.SHORT);
  } catch (error) {
    if (error.response.status === 401) {
      console.log("Access token expired 2");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      await dispatch(fetchToken({ refreshToken: refreshToken }));
      // const { accessToken } = getState().USER;
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (accessToken) {
        const response = await UserServices.fetchUser(accessToken);
        SecureStore.setItemAsync("accountId", response.data.accountId);
        SecureStore.setItemAsync(
          "userInfo",
          JSON.stringify(response.data.customerResponse)
        );
        dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
        ToastAndroid.show("Chào mừng trở lại !", ToastAndroid.SHORT);
      } else {
        dispatch({ type: FETCH_USER_FAIL, payload: error.response?.data });
      }
    } else {
      dispatch({ type: FETCH_USER_FAIL, payload: error.response?.data });
    }
  }
};

export const checkInByUser = (accountId, data) => async (dispatch) => {
  dispatch({ type: CHECK_IN_REQUEST });
  try {
    const response = await UserServices.checkInByUser(data);
    dispatch(GetAppointmentByAccountId(1, 50, accountId));
    dispatch(GetAppointmentByHistoryCustomerId(1, 50, accountId));
    dispatch({ type: CHECK_IN_SUCCESS, payload: response.data });
    ToastAndroid.show("Check in thành công", ToastAndroid.SHORT);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: CHECK_IN_FAILURE, payload: errorMessage });
    console.log("checkInByUser error:", errorMessage);
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
  }
};

export const resetCheckInStatus = () => {
  return {
    type: RESET_CHECK_IN_STATUS,
  };
};
