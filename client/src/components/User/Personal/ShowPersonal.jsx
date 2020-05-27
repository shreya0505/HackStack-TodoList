import React, { useState, useEffect } from "react";

import axios from "axios";
import { getPersonal } from "../../../actions/personal";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Moment from "react-moment";
import { Checkbox, FormControlLabel, IconButton } from "@material-ui/core";
import { Add, Close, ArrowBackIos, Delete } from "@material-ui/icons";

import TaskForm from "../Forms/TaskForm";
import StickyNotesForm from "../Forms/StickyNotesForm";
import CheckListForm from "../Forms/CheckListForm";

export const ShowPersonal = ({
  getPersonal,
  match,
  personal: { loading, project },
  error: { errors },
}) => {
  const [errors_nr, setErrors_nr] = useState([]);
  const [success_nr, setSuccess_nr] = useState([]);
  const [showtform, setShowtform] = useState(false);
  const [showcform, setShowcform] = useState(false);
  const [shownform, setShownform] = useState(false);
  const [tid, setTID] = useState(null);
  const [cid, setCID] = useState(null);
  useEffect(() => {
    async function call_async() {
      await getPersonal(match.params.id);
    }
    call_async();
  }, [match.params.id, getPersonal]);

  const deleteProject = async () => {
    try {
      await axios.delete(`/personal/deleteProject/${match.params.id}`);
      window.location.href = "/dashboard";
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (tid) => {
    try {
      const res = await axios.delete(
        `/personal/deletetask/${match.params.id}/${tid}`
      );
      setErrors_nr([]);
      setSuccess_nr(res.data.success_nr);
      window.location.reload();
    } catch (error) {
      setErrors_nr(error.response.data.error);
    }
  };

  const deleteCheck = async (cid) => {
    try {
      const res = await axios.delete(
        `/personal/deleteChecklist/${match.params.id}/${cid}`
      );
      setErrors_nr([]);
      setSuccess_nr(res.data.success_nr);
      window.location.reload();
    } catch (error) {
      setErrors_nr(error.response.data.error);
    }
  };

  const deleteNote = async (nid) => {
    try {
      const res = await axios.delete(
        `/personal/deleteStickyNotes/${match.params.id}/${nid}`
      );
      setErrors_nr([]);
      setSuccess_nr(res.data.success_nr);
      window.location.reload();
    } catch (error) {
      setErrors_nr(error.response.data.error);
    }
  };

  const toggleCheck = async (id, cid) => {
    try {
      const res = await axios.put(`/personal/togglelist/${id}/${cid}`);

      setErrors_nr([]);
      setSuccess_nr(res.data.success_nr);
      await getPersonal(match.params.id);
    } catch (error) {
      setErrors_nr(error.response.data.error);
    }
  };

  const toggleTask = async (id, tid) => {
    try {
      const res = await axios.put(`/personal/toggletask/${id}/${tid}`);
      setErrors_nr([]);
      setSuccess_nr(res.data.success_nr);
      await getPersonal(match.params.id);
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
            <h1>
              {" "}
              <Link to="/dashboard">
                <ArrowBackIos />
              </Link>{" "}
              {project.title}
              <IconButton
                onClick={() => {
                  deleteProject();
                }}
              >
                <Delete />
              </IconButton>
            </h1>

            <p> {project.description}</p>
            {project.duedate && (
              <p>
                {" "}
                <span class="badge badge-pill badge-danger">
                  {" "}
                  <Moment
                    format=" DD/MM/YY"
                    date={project.duedate}
                    style={{
                      fontFamily: "monospace",
                    }}
                  />
                </span>
                &nbsp;
                <span class="badge badge-pill badge-danger">
                  <Moment
                    format="  HH:mm"
                    date={project.duedate}
                    style={{
                      fontFamily: "monospace",
                    }}
                  />
                </span>
              </p>
            )}
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

                getPersonal(match.params.id);
              }}
            >
              <Close color="secondary" />
            </IconButton>
          )}
        </h2>
        {showtform && (
          <TaskForm id={match.params.id} type="personal" taskid={tid} />
        )}
        {project.task.map((task) => (
          <div
            key={task._id}
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
            <h3>
              {task.taskName}{" "}
              <IconButton
                onClick={() => {
                  setTID(task._id);

                  setShowtform(true);
                }}
                color="primary"
              >
                <Add />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  if (
                    window.confirm(
                      "Are you sure to delete this task? Action cannot be undone."
                    )
                  )
                    deleteTask(task._id);
                }}
              >
                <Delete color="secondary" />
              </IconButton>
            </h3>
            <p> {task.description}</p>
            {task.subtasks.map((subtask, i) => (
              <div key={i}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={subtask.status}
                      color="primary"
                      onChange={(e) => toggleTask(task._id, subtask._id)}
                    />
                  }
                  label={
                    <span>
                      {subtask.sub} &nbsp;
                      {subtask.due && (
                        <Moment
                          format="DD/MM/YY HH:mm"
                          date={subtask.due}
                          className="text-danger"
                          style={{
                            fontFamily: "monospace",
                          }}
                        />
                      )}
                    </span>
                  }
                />
              </div>
            ))}
            {task.schedule.duedate && (
              <div style={{ letterSpacing: "2px", fontFamily: "monospace" }}>
                <b>Date: {"  "}</b>

                <Moment
                  format="DD/MM/YY HH:mm"
                  date={task.schedule.duedate}
                  className="text-danger"
                />
              </div>
            )}
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

                getPersonal(match.params.id);
              }}
            >
              <Close color="secondary" />
            </IconButton>
          )}
        </h2>
        {showcform && (
          <CheckListForm id={match.params.id} type="personal" checkid={cid} />
        )}
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
            <h3>
              {list.listName}
              <IconButton
                onClick={() => {
                  setCID(list._id);
                  setShowcform(true);
                }}
                color="primary"
              >
                <Add />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  if (
                    window.confirm(
                      "Are you sure to delete this checklist? Action cannot be undone."
                    )
                  )
                    deleteCheck(list._id);
                }}
              >
                <Delete color="secondary" />
              </IconButton>
            </h3>

            {list.schedule.duedate && (
              <div style={{ letterSpacing: "2px", fontFamily: "monospace" }}>
                <b>Date: {"  "}</b>

                <Moment
                  format="DD/MM/YY HH:mm"
                  date={list.schedule.duedate}
                  className="text-danger"
                />
              </div>
            )}
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
      <div style={{ marginTop: "30px", marginBottom: "30px" }}>
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

                getPersonal(match.params.id);
              }}
            >
              <Close color="secondary" />
            </IconButton>
          )}
        </h2>
        {shownform && <StickyNotesForm id={match.params.id} type="personal" />}
        {project.notes.map((note) => (
          <div
            key={note._id}
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
            <h3>
              {note.title}{" "}
              <IconButton
                onClick={(e) => {
                  if (
                    window.confirm(
                      "Are you sure to delete this note? Action cannot be undone."
                    )
                  )
                    deleteNote(note._id);
                }}
              >
                <Delete color="secondary" />
              </IconButton>
            </h3>
            <p>{note.message}</p>
          </div>
        ))}
      </div>
      <p
        className="text-muted"
        style={{
          fontFamily: "monospace",
          letterSpacing: "2px",
          textAlign: "center",
        }}
      >
        Date Created :{" "}
        <Moment format="DD/MM/YY HH:mm" date={project.dateCreated} />
      </p>
    </div>
  );
};

ShowPersonal.propTypes = {
  auth: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  personal: PropTypes.object.isRequired,
  getPersonal: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  personal: state.personal,
  error: state.error,
});

export default connect(mapStateToProps, { getPersonal })(ShowPersonal);
