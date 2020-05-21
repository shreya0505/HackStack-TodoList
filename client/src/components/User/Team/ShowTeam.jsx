import React, { useState, useEffect } from "react";

import axios from "axios";
import { getTeam } from "../../../actions/team";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Moment from "react-moment";
import { Checkbox, FormControlLabel, IconButton } from "@material-ui/core";
import { Add, Close } from "@material-ui/icons";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import TaskForm from "../Forms/TaskForm";
import StickyNotesForm from "../Forms/StickyNotesForm";
import CheckListForm from "../Forms/CheckListForm";

const ShowTeam = ({
  getTeam,
  match,
  team: { loading, project },
  error: { errors },
}) => {
  const [errors_nr, setErrors_nr] = useState([]);
  const [success_nr, setSuccess_nr] = useState([]);
  const [showtform, setShowtform] = useState(false);
  const [showcform, setShowcform] = useState(false);
  const [shownform, setShownform] = useState(false);

  useEffect(() => {
    async function call_async() {
      await getTeam(match.params.id);
    }
    call_async();
  }, [match.params.id, getTeam]);

  const toggleCheck = async (id, cid) => {
    try {
      //const res = await axios.put(`/personal/togglelist/${id}/${cid}`);
      //console.log(res);
      setErrors_nr([]);
      //setSuccess_nr(res.data.success_nr);
      await getTeam(match.params.id);
    } catch (error) {
      setErrors_nr(error.response.data.error);
    }
  };

  return loading ? (
    <div className="main-landing">
      <h1> Loading...</h1>
    </div>
  ) : (
    <div>
      <div style={{ marginTop: "110px" }}>
        <div
          style={{
            marginLeft: "5%",
            marginRight: "5%",
            marginBottom: "5%",
            paddingTop: "30px",
          }}
        >
          <div
            style={{
              letterSpacing: "4px",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <h1> {project.title}</h1>
            <p> {project.description}</p>
            <Moment format="DD/MM/YY HH:mm" date={project.startdate} />
            {"    "}to {"    "}
            <Moment format="DD/MM/YY HH:mm" date={project.enddate} />
          </div>
        </div>
      </div>
      <div style={{ marginTop: "30px" }}>
        <hr></hr>
        <h2 style={{ marginLeft: "5%" }}>
          {" "}
          Tasks{" "}
          {!showtform && (
            <IconButton
              onClick={(e) => {
                setShowtform(!showtform);
                
              }}
            >
              <Add color="primary" />
            </IconButton>
          )}
          {showtform && (
            <IconButton
              onClick={(e) => {
                setShowtform(!showtform);
                
                getTeam(match.params.id);
              }}
            >
              <Close color="secondary" />
            </IconButton>
          )}
        </h2>
        {showtform && <TaskForm id={match.params.id} type="team" />}
        {project.task.map((task) => (
          <div
            key={task.id}
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
            <h3>{task.taskName} </h3>
            <p>
              {" "}
              {task.schedule.repeat && task.schedule.daily && (
                <span class="badge badge-secondary">daily</span>
              )}
            </p>

            <p> {task.description}</p>

            <div style={{ letterSpacing: "2px", fontFamily: "monospace" }}>
              <b>Date: {"  "}</b>
              <Moment
                format="DD/MM/YY HH:mm"
                date={project.startdate}
                className="text-success"
              />
              {"    "}to {"    "}
              <Moment
                format="DD/MM/YY HH:mm"
                date={project.enddate}
                className="text-danger"
              />
            </div>
          </div>
        ))}
      </div>
      <hr></hr>
      <div style={{ marginTop: "30px" }}>
        <h2 style={{ marginLeft: "5%" }}>
          {" "}
          Checklists{" "}
          {!showcform && (
            <IconButton
              onClick={(e) => {
                setShowcform(!showcform);
                
              }}
            >
              <Add color="primary" />
            </IconButton>
          )}
          {showcform && (
            <IconButton
              onClick={(e) => {
                setShowcform(!showcform);
                
                getTeam(match.params.id);
              }}
            >
              <Close color="secondary" />
            </IconButton>
          )}
        </h2>
        {showcform && <CheckListForm id={match.params.id} type="team" />}
        {project.checklist.map((list) => (
          <div
            key={list.id}
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
            <h3>{list.listName}</h3>
            <p>
              {" "}
              {list.schedule.repeat && list.schedule.daily && (
                <span class="badge badge-secondary">daily</span>
              )}
            </p>
            <div style={{ letterSpacing: "2px", fontFamily: "monospace" }}>
              <b>Date: {"  "}</b>
              <Moment
                format="DD/MM/YY HH:mm"
                date={project.startdate}
                className="text-success"
              />
              {"    "}to {"    "}
              <Moment
                format="DD/MM/YY HH:mm"
                date={project.enddate}
                className="text-danger"
              />
            </div>
            {list.listItems.map((item) => (
              <div key={item.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.status}
                      color="primary"
                      onChange={(e) => toggleCheck(list._id, item._id)}
                    />
                  }
                  label={item.item}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <hr></hr>
      <div style={{ marginTop: "30px" }}>
        <h2 style={{ marginLeft: "5%" }}>
          {" "}
          Sticky Notes{" "}
          {!shownform && (
            <IconButton
              onClick={(e) => {
                setShownform(!shownform);
                
              }}
            >
              <Add color="primary" />
            </IconButton>
          )}
          {shownform && (
            <IconButton
              onClick={(e) => {
                setShownform(!shownform);
                
                getTeam(match.params.id);
              }}
            >
              <Close color="secondary" />
            </IconButton>
          )}
        </h2>
        {shownform && <StickyNotesForm id={match.params.id} type="team" />}
        {project.notes.map((note) => (
          <div
            key={note.id}
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
            <h3>{note.title}</h3>
            <p>{note.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

ShowTeam.propTypes = {
  error: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
  getTeam: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  team: state.team,
  error: state.error,
});

export default connect(mapStateToProps, { getTeam })(ShowTeam);
