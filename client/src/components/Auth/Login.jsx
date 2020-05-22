import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import G_logo from "../Images/google.svg";
import { AccountCircle } from "@material-ui/icons";

export const Login = ({
  login,
  error: { errors },
  auth: { isAuthenticated },
}) => {
  useEffect(() => {
    if (isAuthenticated) window.location.href = "/dashboard";
  }, [isAuthenticated]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div>
      <div style={{ marginTop: "110px" }}>
        <div
          style={{
            width: "80%",
            marginLeft: "10%",
            marginRight: "10%",
            marginBottom: "10%",
            padding: "20px 10px",
            background: "white",
          }}
          class="border rounded"
        >
          <h1 style={{ letterSpacing: "6px", textAlign: "center" }}> LOGIN</h1>
          {errors.map((error, index) => (
            <div key={index} className="text-danger text-center">
              {error.msg}
            </div>
          ))}
          <div style={{ letterSpacing: "3px" }}>
            <form onSubmit={(e) => onSubmit(e)} class="content">
              <TextField
                variant="outlined"
                fullWidth
                type="text"
                label="Email"
                value={email}
                name="email"
                onChange={(e) => onChange(e)}
                style={{ margin: "10px 5px" }}
                required
              />
              <TextField
                variant="outlined"
                fullWidth
                type="password"
                label="Password"
                value={password}
                name="password"
                onChange={(e) => onChange(e)}
                style={{ margin: "10px 5px" }}
                required
              />

              <button
                class="btn btn-light btn-lg"
                style={{
                  letterSpacing: "2px",
                  marginTop: "20px",
                  fontFamily: "Roboto, sans-serif",
                  color: "#2c2e2e",
                  fontWeight: "500",
                  width:"90%"
                }}
              >
                <AccountCircle />
                &nbsp;Login
              </button>
              <div class="col-sm-12" style={{ textAlign: "center" }}>
                <a href="http://localhost:5000/auth/google" style={{}}>
                  <button
                    type="button"
                    class="btn btn-light btn-lg"
                    style={{
                      marginTop: "30px",
                      width: "100%",
                      textAlign: "center",
                      fontFamily: "Roboto, sans-serif",
                      color: "#2c2e2e",
                      fontWeight: "500",
                    }}
                  >
                    <img
                      src={G_logo}
                      alt="Google Logo"
                      style={{ height: "20px" }}
                    />
                    {"  "}
                    &nbsp; Google
                  </button>
                </a>
              </div>
            </form>
            <p
              style={{
                color: "grey",
                textAlign: "center",
                letterSpacing: "1.5px",
              }}
            >
              {" "}
              Don't have an account? <Link to="/register">Register</Link>{" "}
            </p>
            <p
              style={{
                color: "grey",
                textAlign: "center",
                letterSpacing: "1.5px",
              }}
            >
              {" "}
              Forgot Password? <Link to="/forgot">Reset</Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

export default connect(mapStateToProps, { login })(Login);
