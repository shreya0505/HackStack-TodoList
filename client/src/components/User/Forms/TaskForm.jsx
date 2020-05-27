import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  TextareaAutosize,
  Switch,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
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
  taskName: "",
  description: "",
  priority: 0,
};

const initialState1 = {
  sub: "",
  status: false,
};

export const TaskForm = ({ id, type , taskid}) => {
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const { taskName, description, priority } = formData;
  const [formData1, setFormData1] = useState(initialState1);
  const { sub, status } = formData1;
  const [duedate, setDueDate] = useState(null);
  const [date, setDate] = useState(false);
  const [tid, setTID] = useState(taskid);
  const handleChange = () => {
    setDate(!date);
  };
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onChange1 = (e) => {
    setFormData1({ ...formData1, [e.target.name]: e.target.value });
  };
  const onToggle = (e) => {
    setFormData1({ ...formData1, [e.target.name]: !e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (!date) setDueDate(null);
    const body = JSON.stringify({
      taskName,
      description,
      priority,
      duedate,
    });
    console.log(body);
    let res;
    try {
      if (type === "personal")
        res = await axios.post(`/personal/task/${id}`, body, config);
      if (type === "team")
        res = await axios.post(`/team/task/${id}`, body, config);
      setErrors([]);
      console.log(res.data);
      setSuccess(res.data.success);

      setTID(res.data.id);
      setFormData(initialState);
      setDate(false);
    } catch (error) {
      setErrors(error.response.data.error);
    }
  };

  const onSubmitSub = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (!date) setDueDate(null);
    const due = duedate;
    const body = JSON.stringify({
      sub,
      status,
      due,
    });
    console.log(body);
    let res;
    try {
      if (type === "personal")
        res = await axios.post(`/personal/addsubtask/${tid}`, body, config);
      if (type === "team")
        res = await axios.post(`/team/addsubtask/${tid}`, body, config);
      setErrors([]);
      setSuccess(res.data.success);
      setFormData1(initialState1);
      setDate(false);
    } catch (error) {
      setErrors(error.response.data.error);
    }
  };
  return tid ? (
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
        <form onSubmit={(e) => onSubmitSub(e)} class="content">
          <h4 style={{ textAlign: "center", letterSpacing: "2px" }}>
            Add Subtask
          </h4>

          {errors.map((error, index) => (
            <div key={index} class="alert alert-danger" role="alert">
              {error.msg}
            </div>
          ))}
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            label="SubTask"
            value={sub}
            name="sub"
            onChange={(e) => onChange1(e)}
            style={{ margin: "10px 5px" }}
            required
          />

          <Switch checked={date} onChange={handleChange} />
          <b>Set Due Date</b>
          {date && (
            <div style={{ margin: "40px 5px" }}>
              <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
                Due Date :
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
          )}
          <div>
            <button
              class="btn btn-light btn-lg"
              style={{ letterSpacing: "2px", marginTop: "20px" }}
            >
              ADD
            </button>
          </div>
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
  ) : (
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

          {errors.map((error, index) => (
            <div key={index} class="alert alert-danger" role="alert">
              {error.msg}
            </div>
          ))}
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            label="Task Title"
            value={taskName}
            name="taskName"
            onChange={(e) => onChange(e)}
            style={{ margin: "10px 5px" }}
            required
          />
          <div style={{ margin: "20px 5px" }}>
            <TextareaAutosize
              rowsMin={2}
              style={{
                width: "100%",
                padding: "1% 1%",
                background: "#f2fcfa",
                color: "black",
              }}
              placeholder="Describe your task here"
              value={description}
              name="description"
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
              style={{ textAlign: "left" }}
            >
              {priorities.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <Switch checked={date} onChange={handleChange} />
          <b>Set Due Date</b>
          {date && (
            <div style={{ margin: "40px 5px" }}>
              <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
                Due Date :
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
          )}
          <div>
            <button
              class="btn btn-light btn-lg"
              style={{ letterSpacing: "2px", marginTop: "20px" }}
            >
              CREATE
            </button>
          </div>
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

export default TaskForm;
