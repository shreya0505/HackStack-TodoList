import { GET_TEAM, GET_ERRORS } from "./types";
import axios from "axios";

export const getTeam = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/team/project/${id}`);
    dispatch({
      type: GET_TEAM,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.error,
    });
  }
};
