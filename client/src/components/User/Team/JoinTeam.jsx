import React, { useState } from "react";
import axios from "axios";

import { TextField } from "@material-ui/core";

const JoinTeam = () => {
  const [formData, setFormData] = useState({
    teamid: "",
    teamJoinCode: "",
  });
  const [errors, setErrors] = useState([]);

  const { teamid, teamJoinCode } = formData;
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

    const body = JSON.stringify({ teamJoinCode, teamid });
    try {
      await axios.post(`/team/join/${teamid}`, body, config);
      window.location.href = `/viewTeam/${teamid}`;
    } catch (error) {
      setErrors(error.response.data.error);
    }
  };
  return (
    <div className="content" style={{ marginTop: "100px" }}>
      <h1 style={{ textAlign: "center" }}>Join Team</h1>
      <form
        onSubmit={(e) => {
          onSubmit(e);
        }}
        style={{ margin: "30px 30px", padding: "30px 30px" }}
        class="border rounded"
      >
        {errors.map((error, index) => (
          <div key={index} className="text-danger text-center">
            {error.msg}
          </div>
        ))}

        <TextField
          variant="outlined"
          fullWidth
          type="text"
          label="Team ID"
          name="teamid"
          value={teamid}
          onChange={(e) => onChange(e)}
          style={{ margin: "10px 5px" }}
          required
        />
        <TextField
          variant="outlined"
          fullWidth
          type="text"
          label="Team Join Code"
          name="teamJoinCode"
          value={teamJoinCode}
          onChange={(e) => onChange(e)}
          style={{ margin: "10px 5px" }}
          required
        />

        <button
          class="btn btn-primary btn-lg"
          style={{ letterSpacing: "2px", marginTop: "20px", width: "100%" }}
        >
          JOIN
        </button>
      </form>
    </div>
  );
};

export default JoinTeam;
