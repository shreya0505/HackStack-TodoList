import { GET_ERRORS, NO_LOCAL_TOKEN, USER_LOADED, LOGOUT } from "./types";
import setAuthToken from "../utils/setAuthToken";
import axios from "axios";
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post(`auth/login`, body, config);
    const { token } = res.data;
    localStorage.setItem("token", token);
    setAuthToken(token);
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.error,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get("/auth/user");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.error,
    });
  }
};

export const setNotAuth = () => async (dispatch) => {
  try {
    dispatch({
      type: NO_LOCAL_TOKEN,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.error,
    });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
