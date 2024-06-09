import {
  APPOINTMENT_FAILURE,
  APPOINTMENT_REQUEST,
  APPOINTMENT_SUCCESS,
} from "./action";

const initialState = {
  appointment: null,
  loading: false,
  error: null,
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPOINTMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        appointment: action.payload.items,
      };
    case APPOINTMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default appointmentReducer;
