import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import G_logo from "../Images/google.svg";
import {  PersonAdd } from "@material-ui/icons";

export const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    username: "",
    password: "",
    password2: "",
  });

  const { email, username, name, password, password2 } = formData;
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState([]);
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setErrors([{ msg: "Password doesn't match" }]);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ email, username, name, password });
    try {
      const res = await axios.post(`auth/register`, body, config);
      setErrors([]);
      setSuccess(res.data.success);
    } catch (err) {
      setErrors(err.response.data.error);
    }
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
          <h1 style={{ letterSpacing: "6px", textAlign: "center" }}>
            {" "}
            REGISTER
          </h1>
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
                type="text"
                label="Name"
                value={name}
                name="name"
                onChange={(e) => onChange(e)}
                style={{ margin: "10px 5px" }}
                required
              />

              <TextField
                variant="outlined"
                fullWidth
                type="text"
                label="Username"
                value={username}
                name="username"
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

              <TextField
                variant="outlined"
                fullWidth
                type="password"
                label="Confirm Password"
                value={password2}
                name="password2"
                onChange={(e) => onChange(e)}
                style={{ margin: "10px 5px" }}
                required
              />

              <button
                class="btn btn-light btn-lg"
                style={{
                  letterSpacing: "2px",
                  marginTop: "20px",
                  width: "90%",
                  fontFamily: "Roboto, sans-serif",
                  color: "#2c2e2e",
                  fontWeight: "500",
                }}
              >
                <PersonAdd />
                &nbsp;Register
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
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
