import { GET_TEAM, GET_ACTIVITY } from "../actions/types";

const initialState = {
  project: null,
  loading: true,
  activity: null,
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
    default:
      return state;
  }
}
