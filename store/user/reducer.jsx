import {
  ACT_USER_LOGIN,
  ACT_USER_NOT_FETCH_ME,
  ALL_USER,
  // GET_ALL_ADMIN_AND_SUPERADMIN_USER,
  // GET_ALL_ADMIN_USER,
  // GET_ALL_TRAINEE_USER,
  // GET_ALL_TRAINER_USER,
  // GET_ALL_USER,
  // GET_ALL_USER_FAKE,
  // UPDATE_USER,
  ALL_HOST_COUNT,
  ALL_MEMBER_COUNT,
  AVG_MEMBER_AUCTION,
} from "./action";

const initialState = {
  // fakeUser: [],
  users: [],
  token: null,
  currentUser: null,
  allUser: [],
  allMember: null,
  allHost: null,
  AvgMemberAuction: null,
  // role: null,
  // trainer: [],
  // admin: [],
  // adminAndSuperAdmin: [],
  // trainee: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // case GET_ALL_USER:
    //   return {
    //     ...state,
    //     users: { ...state, users: action.payload },
    //     // users: [...action.payload],
    //   };
    // case GET_ALL_TRAINER_USER:
    //   return {
    //     ...state,
    //     trainer: [...action.payload],
    //   };
    // case GET_ALL_TRAINEE_USER:
    //   return {
    //     ...state,
    //     trainee: [...action.payload],
    //   };
    // case GET_ALL_ADMIN_USER:
    //   return {
    //     ...state,
    //     admin: [...action.payload],
    //   };
    // case GET_ALL_ADMIN_AND_SUPERADMIN_USER:
    //   return {
    //     ...state,
    //     adminAndSuperAdmin: [...action.payload],
    //   };
    // case UPDATE_USER:
    //   return {
    //     ...state,
    //     users: [...state.users, action.payload],
    //     error: null,
    //   };
    case ACT_USER_LOGIN:
      localStorage.setItem("ACCESS_TOKEN", action.payload.token);
      return {
        ...state,
        currentUser: action.payload.currentUser,
        token: action.payload.token,
        role: action.payload.role,
      };
    case ACT_USER_NOT_FETCH_ME:
      localStorage.setItem("ACCESS_TOKEN", null);
      return {
        ...state,
        token: action.payload,
      };
    case ALL_USER:
      return {
        ...state,
        allUser: action.payload,
      };
    case ALL_MEMBER_COUNT:
      return {
        ...state,
        allMember: action.payload,
      };
    case ALL_HOST_COUNT:
      return {
        ...state,
        allHost: action.payload,
      };
    case AVG_MEMBER_AUCTION:
      return {
        ...state,
        AvgMemberAuction: action.payload,
      };
    // case GET_ALL_USER_FAKE:
    //   return {
    //     ...state,
    //     fakeUser: action.payload,
    //   };
    default:
      return state;
  }
};

export default reducer;
