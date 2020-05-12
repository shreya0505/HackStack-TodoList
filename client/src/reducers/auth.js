import { USER_LOADED, NO_LOCAL_TOKEN, LOGOUT } from "../actions/types";
import setAuthToken from "../utils/setAuthToken";

const initialState = {
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case NO_LOCAL_TOKEN:
      return {
        ...state,
        isAuthenticated: false,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };

    case LOGOUT:
      localStorage.removeItem("token");
      setAuthToken(false);
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
}
