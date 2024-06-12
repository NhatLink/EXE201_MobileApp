import {
  APPOINTMENT_FAILURE,
  APPOINTMENT_REQUEST,
  APPOINTMENT_SUCCESS,
  HISTORY_APPOINTMENT_REQUEST,
  HISTORY_APPOINTMENT_SUCCESS,
  HISTORY_APPOINTMENT_FAILURE,
} from "./action";

const initialState = {
  appointment: [],
  historyAppointment: [],
  loading: false,
  error: null,
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPOINTMENT_REQUEST:
    case HISTORY_APPOINTMENT_REQUEST:
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
    case HISTORY_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        historyAppointment: action.payload.items,
      };
    case HISTORY_APPOINTMENT_FAILURE:
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
