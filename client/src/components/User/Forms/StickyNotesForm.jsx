import React, { useState } from "react";
import { TextField, MenuItem, TextareaAutosize } from "@material-ui/core";
import axios from "axios";

const priorities = [
  {
    value: 1,
    label: "High",
  },
  {
    value: 2,
    label: "Urgent",
  },
  {
    value: 3,
    label: "Medium",
  },
  {
    value: 0,
    label: "Low",
  },
];

const initialState = {
  title: "",
  message: "",
  status: false,
  priority: 0,
};

export const StickyNotes = ({ id }) => {
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const { title, message, status, priority } = formData;

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
      message,
      status,
      priority,
    });

    try {
      const res = await axios.post(`/personal/stickyNotes/${id}`, body, config);
      setErrors([]);
      setSuccess(res.data.success);
      setFormData(initialState);
    } catch (error) {
      setErrors(error.response.data.error);
    }
  };

  return (
    <div>
      <div
        className="border rounded"
        style={{
          marginLeft: "10%",
          marginRight: "5%",
          marginBottom: "5%",
          marginTop: "5%",
          padding: "10px 10px",
          overflow: "hidden",
          background: "#FFFF88",
        }}
      >
        {" "}
        <form onSubmit={(e) => onSubmit(e)} class="content">
          <h4 style={{ textAlign: "center", letterSpacing: "2px" }}>
            Add Sticky Notes
          </h4>
          {success.map((success, index) => (
            <div key={index} class="alert alert-success" role="alert">
              {success.msg}
            </div>
          ))}
          {errors.map((error, index) => (
            <div key={index} class="alert alert-danger" role="alert">
              {error.msg}
            </div>
          ))}
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            label="Title"
            value={title}
            name="title"
            onChange={(e) => onChange(e)}
            style={{ margin: "10px 5px", background: "#FFFF88" }}
            required
          />

          <div style={{ margin: "20px 5px" }}>
            <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
              Quick Note
            </h5>
            <TextareaAutosize
              rowsMin={2}
              style={{
                width: "100%",
                padding: "1% 1%",
                background: "#FFFF88",
                color: "black",
              }}
              placeholder="Add a quick message"
              value={message}
              name="message"
              onChange={(e) => onChange(e)}
            ></TextareaAutosize>
          </div>
          <div style={{ margin: "20px 5px" }}>
            <TextField
              select
              label="Priority"
              value={priority}
              name="priority"
              onChange={(e) => onChange(e)}
              fullWidth
              style={{ textAlign: "left", background: "#FFFF88" }}
            >
              {priorities.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <button
            class="btn btn-light btn-lg"
            style={{ letterSpacing: "2px", marginTop: "20px" }}
          >
            CREATE
          </button>
          {success.map((success, index) => (
            <div
              style={{ margin: "20px 5px" }}
              key={index}
              class="alert alert-success"
              role="alert"
            >
              {success.msg}
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default StickyNotes;
