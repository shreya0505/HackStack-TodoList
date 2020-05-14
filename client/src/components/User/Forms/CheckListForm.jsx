import React, { useState } from "react";
import { TextField, MenuItem, TextareaAutosize } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
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
  repeat: false,
  daily: false,
  weekly: [],
  listName: "",

  priority: 0,
};

export const CheckListForm = ({ id }) => {
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const { repeat, daily, weekly, listName, priority } = formData;
  const [startdate, setStartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [inputs, setInputs] = useState(["input-0"]);
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onToggle = (e) => {
    setFormData({ ...formData, [e.target.name]: !e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (startdate && enddate) {
      if (startdate.getTime() > enddate.getTime()) {
        setErrors([{ msg: "Start date must occur before end date" }]);
        return;
      }
    }

    const body = JSON.stringify({
      repeat,
      daily,
      weekly,
      listName,
      priority,
    });

    try {
      const res = await axios.post(`/personal/checklist/${id}`, body, config);
      setErrors([]);
      setSuccess(res.data.success);
      setFormData(initialState);
    } catch (error) {
      setErrors(error.response.data.error);
      console.log(error);
    }
  };
  const appendInput = () => {
    var newInput = `input-${inputs.length}`;
    setInputs(inputs.concat([newInput]));
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
        }}
      >
        {" "}
        <form onSubmit={(e) => onSubmit(e)} class="content">
          <h4 style={{ textAlign: "center", letterSpacing: "2px" }}>
            New Task
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
            label="List Title"
            value={listName}
            name="listName"
            onChange={(e) => onChange(e)}
            style={{ margin: "10px 5px" }}
            required
          />
          <div style={{ margin: "20px 5px" }}>
            {inputs.map((input) => (
              <TextField
                variant="outlined"
                label="List Item"
                style={{ margin: "10px 5px" }}
                fullWidth
                key={input}
                type="text"
              />
            ))}
            <button
              onClick={(e) => {
                e.preventDefault();
                appendInput();
              }}
            >
              CLICK ME TO ADD AN INPUT
            </button>
          </div>
          <div style={{ margin: "20px 5px" }}>
            <TextField
              select
              label="Priority"
              value={priority}
              name="priority"
              onChange={(e) => onChange(e)}
              fullWidth
              style={{ textAlign: "left" }}
            >
              {priorities.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div style={{ margin: "30px 5px" }}>
            <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
              Start Date :
            </h5>
            <h5
              style={{
                textAlign: "left",
                fontFamily: "monospace",
              }}
            >
              <DatePicker
                selected={startdate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </h5>
          </div>

          <div style={{ margin: "40px 5px" }}>
            <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
              End Date :
            </h5>
            <h5
              style={{
                textAlign: "left",
                fontFamily: "monospace",
              }}
            >
              <DatePicker
                selected={enddate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </h5>
          </div>
          <button
            class="btn btn-dark btn-lg"
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

export default CheckListForm;
