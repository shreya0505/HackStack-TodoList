import React from "react";
import Zoom from "react-reveal/Zoom";
const Landing = (props) => {
  return (
    <div className="landing">
      <div className="landing-content">
        <Zoom>
          <h1 style={{ letterSpacing: "5px", textAlign: "center" }}>TODOMO</h1>
        </Zoom>
        <hr style={{ width: "100%" }}></hr>
        <Zoom>
          <h4 style={{ letterSpacing: "2px", textAlign: "center" }}>
            Get more done everyday
          </h4>
        </Zoom>
        <div style={{ textAlign: "center" }}>
          <div class="row">
            <div class="col-sm-6">
              <button
                type="button"
                class="btn btn-dark btn-lg"
                style={{ marginTop: "30px" }}
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Login
              </button>
            </div>
            <div class="col-sm-6">
              <button
                type="button"
                class="btn btn-dark btn-lg"
                style={{ marginTop: "30px" }}
                onClick={() => {
                  window.location.href = "/register";
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
