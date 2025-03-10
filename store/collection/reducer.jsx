import {
  CREATE_COLECTIONL_REQUEST,
  CREATE_COLECTION_SUCCESS,
  DELETE_COLECTION_REQUEST,
  DELETE_COLECTION_SUCCESS,
  GET_COLECTION_REQUEST,
  GET_COLECTION_SUCCESS,
  UPDATE_COLECTION_REQUEST,
  UPDATE_COLECTION_SUCCESS,
  CREATE_COLECTION_FAILURE,
  DELETE_COLECTION_FAILURE,
  GET_COLECTION_FAILURE,
  UPDATE_COLECTION_FAILURE,
} from "./action";

const initialState = {
  collection: [],
  loading: false,
  message: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COLECTIONL_REQUEST:
    case DELETE_COLECTION_REQUEST:
    case GET_COLECTION_REQUEST:
    case UPDATE_COLECTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_COLECTION_FAILURE:
    case DELETE_COLECTION_FAILURE:
    case GET_COLECTION_FAILURE:
    case UPDATE_COLECTION_FAILURE:
      return {
        ...initialState,
      };
    case GET_COLECTION_SUCCESS:
      return {
        ...state,
        collection: action.payload,
        loading: false,
      };
    case DELETE_COLECTION_SUCCESS:
    case CREATE_COLECTION_SUCCESS:
    case UPDATE_COLECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
