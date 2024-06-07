import { ToastAndroid } from "react-native";
import { UserServices } from "../../services/userServices";
import * as SecureStore from "expo-secure-store";
// import { useNavigation } from "@react-navigation/native";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAIL = "FETCH_USER_FAIL";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const GET_USER_BY_ID = "GET_USER_BY_ID";
export const UPDATE_USER_BY_ID = "UPDATE_USER_BY_ID";

// Login action
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await UserServices.loginUser(credentials);
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    dispatch(getUserById(response.data.accountId));
    // Save to SecureStore
    SecureStore.setItemAsync("accessToken", response.data.accessToken);
    SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
    SecureStore.setItemAsync("accountId", response.data.accountId);
    ToastAndroid.show("đăng nhập thành công", ToastAndroid.SHORT);
  } catch (error) {
    console.log("eroor login:", error);
    dispatch({ type: LOGIN_FAIL, payload: error.response.data });
    ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
  }
};

// Fetch user action
export const fetchUser = (data) => async (dispatch) => {
  try {
    const response = await UserServices.fetchMe(data);
    dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_USER_FAIL, payload: error.response.data });
  }
};

// Logout action
export const logoutUser = (credentials) => async (dispatch) => {
  console.log("log out data:", credentials);
  try {
    const response = await UserServices.logoutUser(credentials);
    ToastAndroid.show(response.data, ToastAndroid.SHORT);
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export const registerUser = (data) => async (dispatch) => {
  // const navigation = useNavigation();
  try {
    const response = await UserServices.registerUser(data);
    console.log("registerUser: ", response);
    dispatch({ type: REGISTER_SUCCESS, payload: response.data });
    ToastAndroid.show("Đăng kí thành công", ToastAndroid.SHORT);
    // navigation.navigate("Login");
  } catch (error) {
    dispatch({ type: REGISTER_FAIL, payload: error.response.data });
  }
};

export const getUserById = (id) => async (dispatch) => {
  try {
    const response = await UserServices.getUserById(id);
    dispatch({ type: GET_USER_BY_ID, payload: response.data });
    SecureStore.setItemAsync("userInfo", JSON.stringify(response.data));
    console.log("userInfoLog", response.data);
  } catch (error) {
    console.error("Get user by id error:", error);
  }
};

export const updateUserById = (id, data) => async (dispatch) => {
  console.log("id User Update", id);
  console.log("data user update", data);
  try {
    const response = await UserServices.updateUserById(id, data);
    dispatch({ type: UPDATE_USER_BY_ID, payload: response.data });
    SecureStore.setItemAsync("userInfo", JSON.stringify(response.data));
    ToastAndroid.show("Cập nhật thông tin thành công", ToastAndroid.SHORT);
  } catch (error) {
    console.error("Update user by id error:", error);
  }
};
