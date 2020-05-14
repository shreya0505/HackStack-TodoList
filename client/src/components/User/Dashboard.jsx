import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const Dashboard = ({ auth: { user } }) => {
  return <Fragment></Fragment>;
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  pboards: state.pboards,
});

export default connect(mapStateToProps, {})(Dashboard);
