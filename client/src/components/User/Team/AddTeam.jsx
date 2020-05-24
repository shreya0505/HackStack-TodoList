import React, { useState } from "react";
import { TextField, TextareaAutosize } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";

export const AddTeam = () => {
  const [formData, setFormData] = useState({
    title: "",
    purpose: "",
    label: "",
    teamJoinCode: "",
    teamName: "",
  });

  const [duedate, setDueDate] = useState(null);
  const { title, purpose, label, teamJoinCode, teamName } = formData;

  const [errors, setErrors] = useState([]);

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

    const body = JSON.stringify({
      title,
      purpose,
      label,
      teamJoinCode,
      teamName,
    });
    try {
      const res = await axios.post(`team/`, body, config);
      setErrors([]);
      const id = res.data;
      window.location.href = `/viewTeam/${id}`;
    } catch (error) {
      setErrors(error.response.data.error);
    }
  };

  return (
    <div>
      <div style={{ marginTop: "110px" }}>
        <div
          style={{
            marginLeft: "5%",
            marginRight: "5%",
            marginBottom: "5%",
            paddingTop: "30px",
          }}
          className="border rounded"
        >
          <h2
            style={{
              letterSpacing: "4px",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            START TEAM PROJECT
          </h2>
          {errors.map((error, index) => (
            <div key={index} className="text-danger text-center">
              {error.msg}
            </div>
          ))}

          <div style={{ letterSpacing: "3px" }}>
            <form onSubmit={(e) => onSubmit(e)} class="content">
              <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
                Project Name :
              </h5>
              <TextField
                variant="outlined"
                fullWidth
                type="text"
                label="Title"
                value={title}
                name="title"
                onChange={(e) => onChange(e)}
                style={{ margin: "10px 5px" }}
              />

              <div style={{ margin: "20px 5px" }}>
                <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
                  Purpose of the project :
                </h5>
                <TextareaAutosize
                  rowsMin={2}
                  style={{
                    width: "100%",
                    padding: "1% 1%",
                    background: "#f2fcfa",
                    color: "black",
                  }}
                  placeholder="State the purpose of your project"
                  value={purpose}
                  name="purpose"
                  onChange={(e) => onChange(e)}
                ></TextareaAutosize>
              </div>

              <div style={{ margin: "20px 5px" }}>
                <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
                  Team Name:
                </h5>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="text"
                  label="Team Name"
                  value={teamName}
                  name="teamName"
                  onChange={(e) => onChange(e)}
                  style={{ margin: "10px 5px" }}
                ></TextField>
              </div>

              <div style={{ margin: "20px 5px" }}>
                <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
                  Team Join Passcode :
                </h5>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="text"
                  label="Passcode"
                  value={teamJoinCode}
                  name="teamJoinCode"
                  onChange={(e) => onChange(e)}
                  style={{ margin: "10px 5px" }}
                ></TextField>
              </div>

              <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
                Add Label :
              </h5>
              <TextField
                variant="outlined"
                fullWidth
                type="text"
                label="Label"
                value={label}
                name="label"
                onChange={(e) => onChange(e)}
                style={{ margin: "10px 5px" }}
              />

              <div style={{ margin: "40px 5px" }}>
                <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
                  Due Date
                </h5>
                <h5
                  style={{
                    textAlign: "left",
                    fontFamily: "monospace",
                  }}
                >
                  <DatePicker
                    selected={duedate}
                    onChange={(date) => setDueDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </h5>
              </div>

              <button
                class="btn btn-light btn-lg"
                style={{
                  letterSpacing: "2px",
                  marginTop: "20px",
                  width: "100%",
                }}
              >
                CREATE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeam;
