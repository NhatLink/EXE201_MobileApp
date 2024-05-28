// Assuming this file is named `bookingActions.js`
export const SET_STORE_ID = "SET_STORE_ID";
export const SET_DATE_BOOKING = "SET_DATE_BOOKING";
export const SET_HOUR_BOOKING = "SET_HOUR_BOOKING";
export const ADD_SERVICE = "ADD_SERVICE";
export const UPDATE_SERVICE = "UPDATE_SERVICE";
export const REMOVE_SERVICE = "REMOVE_SERVICE";
export const RESET_BOOKING = "RESET_BOOKING"; // Define the action type as a constant
export const UPDATE_SERVICE_STAFF = "UPDATE_SERVICE_STAFF";

export const setStoreId = (storeId) => ({
  type: SET_STORE_ID,
  payload: storeId,
});

export const setDateBooking = (date) => ({
  type: SET_DATE_BOOKING,
  payload: date,
});

export const setHourBooking = (hour) => ({
  type: SET_HOUR_BOOKING,
  payload: hour,
});

export const addService = (service) => ({
  type: ADD_SERVICE,
  payload: service,
});

export const updateService = (service_id, updatedService) => ({
  type: UPDATE_SERVICE,
  payload: { service_id, updatedService },
});

export const updateServiceStaff = (service_id, staff) => ({
  type: UPDATE_SERVICE_STAFF,
  payload: { service_id, staff },
});

export const removeService = (service_id) => ({
  type: REMOVE_SERVICE,
  payload: service_id,
});

// Adding the RESET_BOOKING action creator
export const resetBooking = () => ({
  type: RESET_BOOKING,
});
