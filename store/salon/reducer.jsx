import {
  ACT_SALON_INFORMATION,
  ACT_SALON_INFORMATION_BY_ID,
  GET_SALON_EMPPLOYEE_BY_SALON_ID,
  GET_SALON_SERVICE_BY_SALON_ID,
  SEARCH_SALON_INFORMATION,
  GET_SALON_FEEDBACK_BY_SALON_ID,
  ACT_SALON_INFORMATION_BY_ID_FAILURE,
  ACT_SALON_INFORMATION_BY_ID_REQUEST,
  ACT_SALON_INFORMATION_BY_ID_SUCCESS,
} from "./action";

const initialState = {
  allSalon: [],
  salonDetail: [],
  salonEmployee: [],
  salonService: [],
  searchSalon: [],
  feedback: [],
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACT_SALON_INFORMATION_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        salonDetail: [],
      };
    case ACT_SALON_INFORMATION:
      return {
        ...state,
        allSalon: action.payload,
      };
    case ACT_SALON_INFORMATION_BY_ID_SUCCESS:
      return {
        ...state,
        salonDetail: action.payload,
        loading: false,
        error: null,
      };
    case ACT_SALON_INFORMATION_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_SALON_EMPPLOYEE_BY_SALON_ID:
      return {
        ...state,
        salonEmployee: action.payload.items,
      };
    case GET_SALON_SERVICE_BY_SALON_ID:
      return {
        ...state,
        salonService: action.payload,
      };
    case SEARCH_SALON_INFORMATION:
      return {
        ...state,
        searchSalon: action.payload,
      };
    case GET_SALON_FEEDBACK_BY_SALON_ID:
      return {
        ...state,
        feedback: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
