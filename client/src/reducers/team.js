import { GET_TEAM, GET_ACTIVITY, GET_ALL } from "../actions/types";

const initialState = {
  project: null,
  loading: true,
  activity: null,
  users: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TEAM:
      return {
        ...state,
        loading: false,
        project: payload,
      };
    case GET_ACTIVITY:
      return {
        ...state,
        loading: false,
        activity: payload,
      };
    case GET_ALL:
      return {
        ...state,
        loading: false,
        users: payload,
      };
    default:
      return state;
  }
}
