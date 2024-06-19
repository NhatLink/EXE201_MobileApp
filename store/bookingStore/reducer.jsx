// const initialState = {
//   storeId: "",
//   dateBooking: "",
//   hourBooking: "",
//   service: [],
//   totalPrice: 0,
//   totalTime: 0,
// };

// const bookingReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "SET_STORE_ID":
//       return { ...state, storeId: action.payload };
//     case "SET_DATE_BOOKING":
//       return { ...state, dateBooking: action.payload };
//     case "SET_HOUR_BOOKING":
//       return { ...state, hourBooking: action.payload };
//     case "ADD_SERVICE":
//       return {
//         ...state,
//         service: [...state.service, action.payload],
//         totalPrice: state.totalPrice + action.payload.price,
//         totalTime: state.totalTime + action.payload.serviceTime,
//       };
//     case "UPDATE_SERVICE":
//       return {
//         ...state,
//         service: state.service.map((service) =>
//           service.service_id === action.payload.service_id
//             ? { ...service, ...action.payload.updatedService }
//             : service
//         ),
//         totalPrice: state.service.reduce(
//           (total, service) => total + service.price,
//           0
//         ),
//         totalTime: state.service.reduce(
//           (total, service) => total + service.serviceTime,
//           0
//         ),
//       };
//     case "REMOVE_SERVICE":
//       return {
//         ...state,
//         service: state.service.filter(
//           (service) => service.service_id !== action.payload
//         ),
//         totalPrice: state.service.reduce(
//           (total, service) => total + service.price,
//           0
//         ),
//         totalTime: state.service.reduce(
//           (total, service) => total + service.serviceTime,
//           0
//         ),
//       };
//     case "RESET_BOOKING":
//       return {
//         ...initialState,
//       };
//     default:
//       return state;
//   }
// };

// export default bookingReducer;

import {
  SET_STORE_ID,
  SET_DATE_BOOKING,
  SET_HOUR_BOOKING,
  ADD_SERVICE,
  UPDATE_SERVICE,
  REMOVE_SERVICE,
  RESET_BOOKING,
  UPDATE_SERVICE_STAFF,
  SET_SERVICE_STAFF,
  SET_SERVICE,
  ADD_VOUCHER,
  REMOVE_VOUCHER,
} from "./action";

const initialState = {
  storeId: null,
  dateBooking: null,
  hourBooking: null,
  services: [],
  serviceStaff: [],
  voucher: [],
  totalPrice: 0,
  totalTime: 0,
};

function bookingReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STORE_ID:
      return { ...state, storeId: action.payload };
    case SET_DATE_BOOKING:
      return {
        ...state,
        dateBooking: action.payload,
      };
    case SET_HOUR_BOOKING:
      return {
        ...state,
        hourBooking: action.payload,
      };
    case SET_SERVICE_STAFF:
      const defaultStaff = {
        id: "0",
        fullName: "Bất cứ ai",
        img: "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png",
      };
      const updatedStaff = [defaultStaff, ...action.payload];
      return {
        ...state,
        serviceStaff: updatedStaff,
      };
    case SET_SERVICE:
      return {
        ...state,
        services: action.payload,
      };
    case ADD_VOUCHER:
      return {
        ...state,
        voucher: action.payload,
      };
    case REMOVE_VOUCHER:
      return {
        ...state,
        voucher: [],
      };
    case ADD_SERVICE:
      return {
        ...state,
        services: [
          ...state.services,
          {
            ...action.payload,
            staff: {
              id: "0",
              fullName: "Bất cứ ai",
              img: "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png",
            },
          },
        ],
        totalPrice: state.totalPrice + action.payload.price,
        totalTime: state.totalTime + action.payload.serviceTime,
      };
    case UPDATE_SERVICE:
      const updatedServices = state.services.map((service) =>
        service.id === action.payload.service_id
          ? { ...service, ...action.payload.updatedService }
          : service
      );
      return {
        ...state,
        services: updatedServices,
        totalPrice: updatedServices.reduce(
          (total, service) => total + service.price,
          0
        ),
        totalTime: updatedServices.reduce(
          (total, service) => total + service.serviceTime,
          0
        ),
      };
    case UPDATE_SERVICE_STAFF:
      const updatedServicesWithStaff = state.services.map((service) =>
        service.id === action.payload.service_id
          ? { ...service, staff: action.payload.staff }
          : service
      );
      return {
        ...state,
        services: updatedServicesWithStaff,
      };
    case REMOVE_SERVICE:
      const remainingServices = state.services.filter(
        (service) => service.id !== action.payload
      );
      return {
        ...state,
        services: remainingServices,
        totalPrice: remainingServices.reduce(
          (total, service) => total + service.price,
          0
        ),
        totalTime: remainingServices.reduce(
          (total, service) => total + service.serviceTime,
          0
        ),
      };
    case RESET_BOOKING:
      return initialState;
    default:
      return state;
  }
}

export default bookingReducer;
