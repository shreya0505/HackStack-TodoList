import React, { useState, useEffect } from "react";

import axios from "axios";
import { getAll } from "../../../actions/team";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { TextField, Tooltip, Button } from "@material-ui/core";

import { AccountCircle } from "@material-ui/icons";

const SendInvite = ({ getAll, match, team: { loading, users } }) => {
  useEffect(() => {
    getAll();
  }, [getAll, match.params.id]);
  const [email, setEmail] = useState(null);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email });
    try {
      const res = await axios.post(
        `/team/sendInvites/${match.params.id}`,
        body,
        config
      );
      setErrors([]);
      setSuccess(res.data.success);
      setEmail(null);
    } catch (error) {
      setErrors(error.response.data.error);
    }
  };
  return !users ? (
    <div className="landing-content">
      <h1>Loading...</h1>
    </div>
  ) : (
    <div
      style={{ marginTop: "100px", textAlign: "center" }}
      className="content"
    >
      <h1 style={{ textAlign: "center" }}>Send Invite</h1>

      <form
        onSubmit={(e) => {
          onSubmit(e);
        }}
        style={{ margin: "30px 30px", padding: "30px 30px" }}
        class="border rounded"
      >
        <h5
          style={{
            textAlign: "center",
            letterSpacing: "1.5px",
          }}
        >
          Add Invitees
        </h5>
        <p
          style={{
            fontSize: "small",
            letterSpacing: "1.5px",
          }}
          className="text-muted"
        >
          Choose from current users or send invitee an email requesting to join
          your team
        </p>
        {errors.map((error, index) => (
          <div key={index} className="text-danger text-center">
            {error.msg}
          </div>
        ))}
        {success.map((success, index) => (
          <div key={index} className="text-success text-center">
            {success.msg}
          </div>
        ))}
        <TextField
          variant="outlined"
          fullWidth
          type="text"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: "10px 5px" }}
          required
        />

        <button
          class="btn btn-primary btn-lg"
          style={{ letterSpacing: "2px", marginTop: "20px", width: "100%" }}
        >
          INVITE
        </button>
      </form>
      <h5
        style={{
          marginTop: "30px",
          textAlign: "center",
          letterSpacing: "1.5px",
        }}
      >
        Current users
      </h5>
      {users.map((user) => (
        <div
          key={user._id}
          style={{ textAlign: "center", marginBottom: "50px" }}
        >
          {email && user.email.includes(email) && (
            <Tooltip title={user.email}>
              <Button
                onClick={() => setEmail(user.email)}
                class="btn btn-light btn-lg"
                style={{
                  letterSpacing: "2px",
                  marginTop: "20px",
                  width: "90%",
                  fontFamily: "Roboto, sans-serif",
                  color: "#2c2e2e",
                  fontWeight: "400",
                }}
              >
                <AccountCircle />
                &nbsp;&nbsp;{user.username}&nbsp;{" "}
              </Button>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};
SendInvite.propTypes = {
  error: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getTeam: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  team: state.team,
  error: state.error,
});

export default connect(mapStateToProps, { getAll })(SendInvite);
