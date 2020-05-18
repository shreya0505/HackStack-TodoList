import { GET_TEAM } from "../actions/types";

const initialState = {
    project: null,
    loading: true,
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
        
        default:
            return state;
    }
}
