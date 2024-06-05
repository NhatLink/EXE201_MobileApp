import { ACT_SALON_INFORMATION, ACT_SALON_INFORMATION_BY_ID } from "./action";

const initialState = {
  allSalon: null,
  salonDetail: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACT_SALON_INFORMATION:
      return {
        ...state,
        allSalon: action.payload,
      };
    case ACT_SALON_INFORMATION_BY_ID:
      return {
        ...state,
        salonDetail: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
