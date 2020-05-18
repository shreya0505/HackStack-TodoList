import React, { useState } from "react";
import { TextField, TextareaAutosize } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";

export const AddPersonal = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    label: "",
  });

  const [startdate, setStartDate] = useState(null);
  const [enddate, setEndDate] = useState(null);
  const { title, description, label } = formData;

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

    if (startdate && enddate) {
      if (startdate.getTime() > enddate.getTime()) {
        setErrors([{ msg: "Start date must occur before end date" }]);
        return;
      }
      if (startdate.getTime() === enddate.getTime()) {
        setStartDate(null);
        setEndDate(null);
      }
    }

    const body = JSON.stringify({
      title,
      description,
      label,
      startdate,
      enddate,
    });
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
                  rowsMin={6}
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

              <div style={{ margin: "30px 5px" }}>
                <h5 style={{ textAlign: "left", letterSpacing: "2px" }}>
                  Start Date
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
                  End Date
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPersonal;
