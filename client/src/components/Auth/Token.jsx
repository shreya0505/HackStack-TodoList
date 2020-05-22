import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import setAuthToken from "../../utils/setAuthToken";
import { loadUser } from "../../actions/auth";
import store from "../../store";

const Token = ({ match }) => {
  useEffect(() => {
    setAuthToken(match.params.id);
    localStorage.setItem("token", match.params.id);
    store.dispatch(loadUser());
    if (localStorage.token) window.location.href = "/dashboard";
  }, [match.params.id, localStorage.token]);
  return localStorage.token ? (
    <div>
      <Redirect to="/dashboard" />
    </div>
  ) : (
    <h1 className="landing-content">
      {" "}
      Loading... {localStorage.token && <Redirect to="/dashboard" />}
    </h1>
  );
};

export default Token;
