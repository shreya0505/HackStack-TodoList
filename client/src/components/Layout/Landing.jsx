import React from "react";
import Zoom from "react-reveal/Zoom";
import G_logo from "../Images/google.svg";
import { AccountCircle, PersonAdd } from "@material-ui/icons";

const Landing = (props) => {
  return (
    <div className="landing">
      <div className="landing-content">
        <Zoom>
          <h1 style={{ letterSpacing: "5px", textAlign: "center" }}>TODOMOR</h1>
        </Zoom>
        <hr style={{ width: "100%" }}></hr>
        <Zoom>
          <h4 style={{ letterSpacing: "2px", textAlign: "center" }}>
            Get more done everyday
          </h4>
        </Zoom>
        <div style={{ textAlign: "center" }}>
          <div class="row">
            <div class="col-md-6" style={{ textAlign: "center" }}>
              <button
                type="button"
                class="btn btn-light btn-lg"
                style={{ marginTop: "30px", width: "90%" }}
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                <AccountCircle />
                &nbsp;Login
              </button>
            </div>
            <div class="col-md-6" style={{ textAlign: "center" }}>
              <button
                type="button"
                class="btn btn-light btn-lg"
                style={{ marginTop: "30px", width: "90%" }}
                onClick={() => {
                  window.location.href = "/register";
                }}
              >
                <PersonAdd />
                &nbsp;Register
              </button>
            </div>
                <hr></hr>
            <div class="col-sm-12" style={{ textAlign: "center" }}>
              <a href="http://localhost:5000/auth/google" style={{}}>
                <button
                  type="button"
                  class="btn btn-light btn-lg"
                  style={{
                    marginTop: "30px",
                    width: "90%",
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
