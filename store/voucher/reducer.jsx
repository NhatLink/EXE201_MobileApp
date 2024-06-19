import {
  GET_VOUCHER_ID_FAILURE,
  GET_VOUCHER_ID_REQUEST,
  GET_VOUCHER_ID_SUCCESS,
} from "./action";

const initialState = {
  loading: false,
  voucherBySalonId: [],
  error: null,
};

const voucherServiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VOUCHER_ID_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_VOUCHER_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        voucherBySalonId: action.payload.items,
        error: null,
      };
    case GET_VOUCHER_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        voucherBySalonId: [],
      };
    default:
      return state;
  }
};

export default voucherServiceReducer;
