import { ToastAndroid } from "react-native";
import { collectionService } from "../../services/collectionService";

export const CREATE_COLECTIONL_REQUEST = "CREATE_COLECTIONL_REQUEST";
export const CREATE_COLECTION_SUCCESS = "CREATE_COLECTION_SUCCESS";
// export const CREATE_COLECTION_FAILURE = "CREATE_COLECTION_FAILURE";

export const GET_COLECTION_REQUEST = "GET_COLECTION_REQUEST";
export const GET_COLECTION_SUCCESS = "GET_COLECTION_SUCCESS";
// export const GET_COLECTION_FAILURE = "GET_COLECTION_FAILURE";

export const UPDATE_COLECTION_REQUEST = "UPDATE_COLECTION_REQUEST";
export const UPDATE_COLECTION_SUCCESS = "UPDATE_COLECTION_SUCCESS";
// export const UPDATE_COLECTION_FAILURE = "UPDATE_COLECTION_FAILURE";

export const DELETE_COLECTION_REQUEST = "DELETE_COLECTION_REQUEST";
export const DELETE_COLECTION_SUCCESS = "DELETE_COLECTION_SUCCESS";
// export const DELETE_COLECTION_FAILURE = "DELETE_COLECTION_FAILURE";

export const GetCustomerImageHistoryByCustomerId =
  (page, size, id) => async (dispatch) => {
    dispatch({ type: GET_COLECTION_REQUEST });
    try {
      const response =
        await collectionService.GetCustomerImageHistoryByCustomerId(
          page,
          size,
          id
        );
      dispatch({ type: GET_COLECTION_SUCCESS, payload: response.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    }
  };

export const SaveAsCustomerImageHistory = (id, data) => async (dispatch) => {
  dispatch({ type: CREATE_COLECTIONL_REQUEST });
  try {
    const response = await collectionService.SaveAsCustomerImageHistory(data);
    dispatch(GetCustomerImageHistoryByCustomerId(1, 10, id));
    dispatch({ type: CREATE_COLECTION_SUCCESS, payload: response.data });
    ToastAndroid.show("Tạo bộ sưu tập thành công", ToastAndroid.SHORT);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
  }
};

export const UpdateCustomerImageHistory =
  (id, data, customerId) => async (dispatch) => {
    dispatch({ type: UPDATE_COLECTION_REQUEST });
    try {
      const response = await collectionService.UpdateCustomerImageHistory(
        id,
        data
      );
      dispatch(GetCustomerImageHistoryByCustomerId(1, 10, customerId));
      dispatch({ type: UPDATE_COLECTION_SUCCESS, payload: response.data });
      ToastAndroid.show("Cập nhật bộ sưu tập thành công", ToastAndroid.SHORT);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    }
  };

export const DeleteCustomerImageHistory =
  (id, customerId) => async (dispatch) => {
    dispatch({ type: DELETE_COLECTION_REQUEST });
    try {
      const response = await collectionService.DeleteCustomerImageHistory(id);
      dispatch(GetCustomerImageHistoryByCustomerId(1, 10, customerId));
      dispatch({ type: DELETE_COLECTION_SUCCESS, payload: response.data });
      ToastAndroid.show("Xóa bộ sưu tập thành công", ToastAndroid.SHORT);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    }
  };
