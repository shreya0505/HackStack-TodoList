import { GET_PERSONAL, GET_ERRORS, GET_CHECKLIST } from "./types";
import axios from "axios";
export const getPersonal = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/personal/project/${id}`);
    dispatch({
      type: GET_PERSONAL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.error,
    });
  }
};

export const getChecklist = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/personal/checklist/${id}`);
    dispatch({
      type: GET_CHECKLIST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.error,
    });
  }
};
