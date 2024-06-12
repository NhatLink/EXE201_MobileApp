import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  GET_USER_BY_ID,
  UPDATE_USER_BY_ID,
  FETCH_TOKEN_FAIL,
  FETCH_TOKEN_SUCCESS,
} from "./action";

const initialState = {
  error: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  accountId: null,
  user: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        accountId: action.payload.accountId,
        user: action.payload.customerResponse,
        error: null,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        error: action.payload,
        isAuthenticated: false,
      };
    case FETCH_TOKEN_SUCCESS:
      return {
        ...state,
        error: null,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case FETCH_TOKEN_FAIL:
      return {
        ...initialState,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        error: null,
        user: action.payload.customerResponse,
      };
    case FETCH_USER_FAIL:
      return {
        ...state,
        error: action.payload,
        user: null,
      };
    case LOGOUT_SUCCESS:
      return {
        ...initialState,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        register: action.payload,
        error: null,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_USER_BY_ID:
      return {
        ...state,
        user: action.payload,
      };
    case UPDATE_USER_BY_ID:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
