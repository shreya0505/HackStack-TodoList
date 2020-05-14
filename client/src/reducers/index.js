import { combineReducers } from "redux";
import auth from "./auth";
import error from "./error";
import personal from "./personal";

export default combineReducers({
  auth: auth,
  error: error,
  personal: personal
});
