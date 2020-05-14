import { GET_PERSONAL } from "../actions/types";

const initialState = {
  loading: true,
  personal: null,
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
    default:
      return state;
  }
}
