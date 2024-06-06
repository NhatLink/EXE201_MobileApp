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
        error: null,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        error: action.payload,
        isAuthenticated: false,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        error: null,
      };
    case FETCH_USER_FAIL:
      return {
        ...state,
        error: action.payload,
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
