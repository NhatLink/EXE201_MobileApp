import { REPORT_REQUEST, REPORT_SUCCESS, REPORT_FAILURE } from "./action";

const initialState = {
  loading: false,
  customerReport: [],
  error: null,
};

const reportServiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case REPORT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        customerReport: action.payload,
        error: null,
      };
    case REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        customerReport: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reportServiceReducer;
