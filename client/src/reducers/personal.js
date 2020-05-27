import {
  GET_PERSONAL,
  GET_CHECKLIST,
  GET_MIN_PERSONAL,
} from "../actions/types";

const initialState = {
  personal: null,
  loading: true,
  checklist: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PERSONAL:
      return {
        ...state,
        loading: false,
        project: payload,
      };
    case GET_MIN_PERSONAL:
      return {
        ...state,
        loading: false,
        project: payload,
      };
    case GET_CHECKLIST:
      return {
        ...state,
        loading: false,
        checklist: payload,
      };
    default:
      return state;
  }
}
