import React, { useState } from "react";
import { TextField, TextareaAutosize, Switch } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";

export const AddPersonal = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    label: "",
  });

  const [duedate, setDueDate] = useState(null);
  const [date, setDate] = useState(false);
  const { title, description, label } = formData;

  const [errors, setErrors] = useState([]);
  const handleChange = () => {
    setDate(!date);
  };
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
    if (!date) setDueDate(null);

    const body = JSON.stringify({
      title,
      description,
      label,
      duedate,
    });
    console.log(body);
    try {
      const res = await axios.post(`personal/`, body, config);
      setErrors([]);
      const id = res.data;
      window.location.href = `/viewPersonal/${id}`;
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
            START NEW PROJECT
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
                  Description of the project :
                </h5>
                <TextareaAutosize
                  rowsMin={2}
                  style={{
                    width: "100%",
                    padding: "1% 1%",
                    background: "#f2fcfa",
                    color: "black",
                  }}
                  placeholder="Describe your query here"
                  value={description}
                  name="description"
                  onChange={(e) => onChange(e)}
                ></TextareaAutosize>
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
              <Switch checked={date} onChange={handleChange} />
              <b>Set Due Date</b>
              {date && (
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
              )}
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

export default AddPersonal;
