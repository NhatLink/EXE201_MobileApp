import { GET_NOTIFICATION, NEW_NOTIFICATION } from "./action";

const initialState = {
  notificationList: [],
  newNoti: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return {
        ...state,
        notificationList: action.payload,
      };
    case NEW_NOTIFICATION:
      return {
        ...state,
        newNoti: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
