import { GET_TEAM, GET_ERRORS, GET_ACTIVITY, GET_ALL } from "./types";
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

export const getActivity = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/team/activity/${id}`);
  
    dispatch({
      type: GET_ACTIVITY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.error,
    });
  }
};

export const getAll = () => async (dispatch) => {
  try {
    const res = await axios.get(`/team/all`);

    dispatch({
      type: GET_ALL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.error,
    });
  }
};
