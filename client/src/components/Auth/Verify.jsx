import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import axios from "axios";
import { Link } from "react-router-dom";

export const Verify = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const { email, otp } = formData;
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState([]);
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ email, otp });
    try {
      const res = await axios.post(`auth/verify`, body, config);
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
          <h1 style={{ letterSpacing: "6px", textAlign: "center" }}> VERIFY</h1>
          {errors.map((error, index) => (
            <div key={index} className="text-danger text-center">
              {error.msg}
            </div>
          ))}
          {success.map((success_item, index) => (
            <div key={index} className="text-success text-center">
              {success_item.msg}
              <br></br>
              <Link to="/login">Login</Link>
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
                label="OTP"
                value={otp}
                name="otp"
                onChange={(e) => onChange(e)}
                style={{ margin: "10px 5px" }}
                required
              />

              <button
                class="btn btn-primary btn-lg"
                style={{ letterSpacing: "2px", marginTop: "20px" }}
              >
                VERIFY
              </button>
            </form>
            <p
              style={{
                color: "grey",
                textAlign: "center",
                letterSpacing: "1.5px",
              }}
            >
              Already verified? <Link to="/login">Login</Link>
            </p>
            <p
              style={{
                color: "grey",
                textAlign: "center",
                letterSpacing: "1.5px",
              }}
            >
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
