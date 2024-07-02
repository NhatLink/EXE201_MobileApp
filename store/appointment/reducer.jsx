import {
  APPOINTMENT_FAILURE,
  APPOINTMENT_REQUEST,
  APPOINTMENT_SUCCESS,
  HISTORY_APPOINTMENT_REQUEST,
  HISTORY_APPOINTMENT_SUCCESS,
  HISTORY_APPOINTMENT_FAILURE,
  CANCEL_APPOINTMENT_FAILURE,
  CANCEL_APPOINTMENT_REQUEST,
  CANCEL_APPOINTMENT_SUCCESS,
  APPOINTMENT_ID_FAILURE,
  APPOINTMENT_ID_REQUEST,
  APPOINTMENT_ID_SUCCESS,
  FEEDBACK_APPOINTMENT_ID_FAILURE,
  FEEDBACK_APPOINTMENT_ID_SUCCESS,
} from "./action";

const initialState = {
  appointment: [],
  appointmentDetail: null,
  historyAppointment: [],
  loading: false,
  error: null,
  feedbackAppointment: [],
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPOINTMENT_REQUEST:
    case APPOINTMENT_ID_REQUEST:
    case HISTORY_APPOINTMENT_REQUEST:
    case CANCEL_APPOINTMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        appointment: action.payload.items,
        error: null,
      };
    // const newItems = {};
    // if (action.payload.items && action.payload.items.length > 0) {
    //   action.payload.items.forEach((appointment) => {
    //     const dateSchedule = appointment.startDate.split("T")[0];
    //     if (!newItems[dateSchedule]) {
    //       newItems[dateSchedule] = [];
    //     }
    //     newItems[dateSchedule].push(appointment);
    //   });
    // }
    // return {
    //   ...state,
    //   appointment: newItems,
    //   loading: false,
    // };
    case APPOINTMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case APPOINTMENT_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        appointmentDetail: action.payload,
        error: null,
      };
    case APPOINTMENT_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FEEDBACK_APPOINTMENT_ID_SUCCESS:
      return {
        ...state,
        feedbackAppointment: action.payload,
        error: null,
      };
    case FEEDBACK_APPOINTMENT_ID_FAILURE:
      return {
        ...state,
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
    case CANCEL_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CANCEL_APPOINTMENT_FAILURE:
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
