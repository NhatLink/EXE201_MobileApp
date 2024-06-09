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
export const FETCH_TOKEN_SUCCESS = "FETCH_TOKEN_SUCCESS";
export const FETCH_TOKEN_FAIL = "FETCH_TOKEN_FAIL";
// Login action
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await UserServices.loginUser(credentials);
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    dispatch(fetchUser(response.data.accessToken));
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
export const fetchToken = (data) => async (dispatch) => {
  try {
    const response = await UserServices.fetchToken(data);
    dispatch({ type: FETCH_TOKEN_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TOKEN_FAIL, payload: error.response.data });
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

export const registerUser = (data) => async (dispatch) => {
  // const navigation = useNavigation();
  try {
    const response = await UserServices.registerUser(data);
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
  } catch (error) {
    console.error("Get user by id error:", error);
  }
};

export const updateUserById = (id, data) => async (dispatch) => {
  try {
    const response = await UserServices.updateUserById(id, data);
    dispatch({ type: UPDATE_USER_BY_ID, payload: response.data });
    SecureStore.setItemAsync("userInfo", JSON.stringify(response.data));
    ToastAndroid.show("Cập nhật thông tin thành công", ToastAndroid.SHORT);
  } catch (error) {
    console.error("Update user by id error:", error);
  }
};

export const fetchUser = (accessToken) => async (dispatch) => {
  try {
    const response = await UserServices.fetchUser(accessToken);
    SecureStore.setItemAsync("userInfo", JSON.stringify(response.data));
    dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
  } catch (error) {
    if (error.response.status === 401) {
      // accessToken expired, try to refresh it
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        const refreshResponse = await UserServices.fetchToken(refreshToken);
        SecureStore.setItemAsync("accessToken", refreshResponse.data);
        dispatch({ type: FETCH_TOKEN_SUCCESS, payload: refreshResponse.data });
        // retry fetching user with new accessToken
        const retryResponse = await UserServices.fetchUser(
          refreshResponse.data
        );
        dispatch({ type: FETCH_USER_SUCCESS, payload: retryResponse.data });
      } catch (refreshError) {
        if (refreshError.response.status === 400) {
          console.log("Refresh token expired");
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
