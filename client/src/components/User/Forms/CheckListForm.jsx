import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  IconButton,
  FormControlLabel,
  Checkbox,
  Switch,
} from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";
import { getChecklist } from "../../../actions/personal";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ArrowBackIos } from "@material-ui/icons";
import Moment from "react-moment";

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
  listName: "",
  priority: 0,
};
const initialItemState = {
  status: false,
  listitem: "",
};

export const CheckListForm = ({
  id,
  type,
  checkid,
  personal: { loading, checklist },
  error: { errors },
  getChecklist,
}) => {
  const [errors_nr, setErrors_nr] = useState([]);
  const [success, setSuccess] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const { listName, priority } = formData;
  const [duedate, setDueDate] = useState(new Date());
  const [cid, setcid] = useState(checkid);
  const [itemForm, setItemData] = useState(initialItemState);
  const { status, listitem } = itemForm;
  const [date, setDate] = useState(false);
  const handleChange = () => {
    setDate(!date);
  };
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setItemData({ ...itemForm, [e.target.name]: e.target.value });
  };
  const onToggle2 = (e) => {
    setItemData({ ...itemForm, [e.target.name]: !e.target.value });
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
      duedate,
      listName,
      priority,
    });

    try {
      let res;
      if (type === "personal")
        res = await axios.post(`/personal/checklist/${id}`, body, config);
      if (type === "team")
        res = await axios.post(`/team/checklist/${id}`, body, config);
      setErrors_nr([]);
      setSuccess(res.data.success);
      setFormData(initialState);
      setcid(res.data.id);
    } catch (error) {
      setErrors_nr(error.response.data.error);

      setSuccess([]);
    }
  };

  const onSubmit2 = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      listitem,
      status,
      duedate,
    });
    try {
      let res;
      if (type === "personal")
        res = await axios.post(`/personal/addlistitem/${cid}`, body, config);
      if (type === "team")
        res = await axios.post(`/team/addlistitem/${cid}`, body, config);

      setErrors_nr([]);
      setSuccess(res.data.success);
      setItemData(initialItemState);
      getChecklist(cid);
    } catch (error) {
      setErrors_nr(error.response.data.error);

      setSuccess([]);
    }
  };

  return cid ? (
    <div>
      <div
        style={{
          marginLeft: "10%",
          marginRight: "5%",
          marginBottom: "5%",
          marginTop: "5%",
          padding: "10px 10px",
          overflow: "hidden",
          textAlign: "left",
        }}
      >
        <h4 style={{ letterSpacing: "2px" }}>Add Item</h4>

        {errors.map((error, index) => (
          <div key={index} className="text-danger text-center">
            {error.msg}
          </div>
        ))}

        <form onSubmit={(e) => onSubmit2(e)}>
          <div
            style={{ textAlign: "left", padding: "5px 5px" }}
            clasName="border rounded"
          >
            <TextField
              variant="outlined"
              halfwidth
              type="text"
              label="List Item"
              value={listitem}
              name="listitem"
              onChange={(e) => onChange2(e)}
              style={{ margin: "10px 5px" }}
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={status}
                  color="primary"
                  name="status"
                  size="medium"
                  onChange={(e) => onToggle2(e)}
                />
              }
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                fontWeight: "bold",
              }}
              label="Status: "
              labelPlacement="start"
            />
            <div>
              <button
                class="btn btn-light btn-lg"
                style={{ letterSpacing: "2px", marginTop: "20px" }}
              >
                Add Item
              </button>
            </div>
          </div>
        </form>
        {!loading && checklist && cid && (
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
            <h3 style={{ letterSpacing: "3px" }}>
              {" "}
              PREVIEW: {checklist.listName}
            </h3>

            {date && (
              <div style={{ letterSpacing: "2px", fontFamily: "monospace" }}>
                <b>Date: {"  "}</b>
                <Moment
                  format="DD/MM/YY HH:mm"
                  date={checklist.schedule.duedate}
                  className="text-success"
                />
              </div>
            )}
            {checklist.listItems.map((item) => (
              <div key={item.id}>
                <FormControlLabel
                  control={<Checkbox checked={item.status} color="primary" />}
                  label={item.item}
                  disabled
                />
              </div>
            ))}
          </div>
        )}
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
            New Checklist
          </h4>
          {success.map((success, index) => (
            <div key={index} class="alert alert-success" role="alert">
              {success.msg}
            </div>
          ))}
          {errors_nr.map((error, index) => (
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
              <Switch checked={date} onChange={handleChange} />
              <b>Set Due Date</b>
              {date && (
                <DatePicker
                  selected={duedate}
                  onChange={(date) => setDueDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              )}
            </h5>
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

CheckListForm.propTypes = {
  auth: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  personal: PropTypes.object.isRequired,
  getChecklist: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  personal: state.personal,
  error: state.error,
});

export default connect(mapStateToProps, { getChecklist })(CheckListForm);
