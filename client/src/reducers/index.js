import { combineReducers } from "redux";
import auth from "./auth";
import error from "./error";

export default combineReducers({
  auth: auth,
  error: error,
});
