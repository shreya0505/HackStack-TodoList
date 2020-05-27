import React, { useState, useEffect } from "react";

import axios from "axios";
import { getTeam } from "../../../actions/team";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Moment from "react-moment";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Button,
} from "@material-ui/core";
import {
  Add,
  Close,
  ArrowBackIos,
  Event,
  ImportExport,
  GroupAdd,
  ContactsOutlined,
  LibraryBooksOutlined,
  Delete,
} from "@material-ui/icons";
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
  auth: { user },
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
      await getTeam(match.params.id);
    }
    call_async();
  }, [match.params.id, getTeam]);

  const toggleCheck = async (id, cid) => {
    try {
      const res = await axios.put(`/team/togglelist/${id}/${cid}`);
      setErrors_nr([]);
      setSuccess_nr(res.data.success_nr);
      await getTeam(match.params.id);
    } catch (error) {
      setErrors_nr(error.response.data.error);
    }
  };

  const deleteProject = async () => {
    try {
      await axios.delete(`/team/deleteProject/${match.params.id}`);
      window.location.href = "/dashboard";
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (tid) => {
    try {
      const res = await axios.delete(
        `/team/deletetask/${tid}/${match.params.id}`
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
        `/team/deleteChecklist/${cid}/${match.params.id}`
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
        `/team/deleteStickyNotes/${nid}/${match.params.id}`
      );
      setErrors_nr([]);
      setSuccess_nr(res.data.success_nr);
      window.location.reload();
    } catch (error) {
      setErrors_nr(error.response.data.error);
    }
  };

  const toggleTask = async (id, tid) => {
    try {
      const res = await axios.put(`/team/toggletask/${id}/${tid}`);
      setErrors_nr([]);
      setSuccess_nr(res.data.success_nr);
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
            <h1>
              {" "}
              <Link to="/dashboard">
                <ArrowBackIos />
              </Link>
              {project.title}
              <IconButton
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure to delete this project? Action cannot be undone."
                    )
                  )
                    deleteProject();
                }}
              >
                <Delete />
              </IconButton>
            </h1>
            <p>{project.purpose}</p>
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
            <p className="border rounded" style={{ padding: "10px 10px" }}>
              {" "}
              <b>Members</b>
              {project.teamMembers.map((member, i) => (
                <div key={member._id} className="text-muted text-center">
                  {i + 1}. &nbsp;{member.username}&nbsp;
                </div>
              ))}
            </p>
          </div>
          <div className="container">
            <div className="row">
              <div
                style={{
                  textAlign: "center",
                  marginTop: "50px",
                  marginBottom: "50px",
                }}
                className="col-lg-6 col-md-12"
              >
                <h4>Project Controls</h4>

                {user._id === project.manager._id && (
                  <button
                    onClick={() =>
                      (window.location.href = `/invite/${match.params.id}`)
                    }
                    class="btn btn-light btn-lg"
                    style={{
                      letterSpacing: "2px",
                      marginTop: "20px",
                      width: "90%",
                      fontFamily: "Roboto, sans-serif",
                      color: "#2c2e2e",
                      fontWeight: "400",
                    }}
                  >
                    <GroupAdd />
                    &nbsp;&nbsp;Add Members&nbsp;{" "}
                    <span class="badge badge-info" style={{ float: "right" }}>
                      {project.teamMembers.length}
                    </span>
                  </button>
                )}
                {user._id !== project.manager._id && (
                  <button
                    onClick={() => (window.location.href = "/addProject")}
                    class="btn btn-light btn-lg"
                    style={{
                      letterSpacing: "2px",
                      marginTop: "20px",
                      width: "90%",
                      fontFamily: "Roboto, sans-serif",
                      color: "#2c2e2e",
                      fontWeight: "400",
                    }}
                  >
                    <ContactsOutlined />
                    &nbsp;&nbsp;View Members&nbsp;{" "}
                    <span class="badge badge-info" style={{ float: "right" }}>
                      {project.teamMembers.length}
                    </span>
                  </button>
                )}
                <button
                  onClick={() =>
                    (window.location.href = `/activity/${project._id}`)
                  }
                  class="btn btn-light btn-lg"
                  style={{
                    letterSpacing: "2px",
                    marginTop: "20px",
                    width: "90%",
                    fontFamily: "Roboto, sans-serif",
                    color: "#2c2e2e",
                    fontWeight: "400",
                  }}
                >
                  <LibraryBooksOutlined />
                  &nbsp; View Logs &nbsp;
                  <span class="badge badge-info" style={{ float: "right" }}>
                    {project.activityLog.length}
                  </span>
                </button>
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "50px",
                  marginBottom: "50px",
                }}
                className="col-lg-6 col-md-12"
              >
                <h4>Filter </h4>
                <button
                  class="btn btn-light btn-lg"
                  style={{
                    letterSpacing: "2px",
                    marginTop: "20px",
                    width: "90%",
                    fontFamily: "Roboto, sans-serif",
                    color: "#2c2e2e",
                    fontWeight: "400",
                  }}
                >
                  <ImportExport />
                  &nbsp;&nbsp;Priority&nbsp;{" "}
                </button>
                <button
                  class="btn btn-light btn-lg"
                  style={{
                    letterSpacing: "2px",
                    marginTop: "20px",
                    width: "90%",
                    fontFamily: "Roboto, sans-serif",
                    color: "#2c2e2e",
                    fontWeight: "400",
                  }}
                >
                  <Event />
                  &nbsp; Due Date &nbsp;
                </button>
              </div>
            </div>
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
        {showtform && (
          <TaskForm id={match.params.id} type="team" taskid={tid} />
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
              </IconButton>{" "}
            </h3>
            <p>
              {task.priority === 0 && (
                <span class="badge badge-warning">Low</span>
              )}
              {task.priority === 3 && (
                <span class="badge badge-secondary">Medium</span>
              )}
              {task.priority === 2 && (
                <span class="badge badge-danger">Urgent</span>
              )}
              {task.priority === 1 && (
                <span class="badge badge-dark">High</span>
              )}
            </p>
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

                getTeam(match.params.id);
              }}
            >
              <Close color="secondary" />
            </IconButton>
          )}
        </h2>
        {showcform && (
          <CheckListForm id={match.params.id} type="team" checkid={cid} />
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
              {list.listName}{" "}
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
            <p>
              {list.priority === 0 && (
                <span class="badge badge-warning">Low</span>
              )}
              {list.priority === 3 && (
                <span class="badge badge-secondary">Medium</span>
              )}
              {list.priority === 2 && (
                <span class="badge badge-danger">Urgent</span>
              )}
              {list.priority === 1 && (
                <span class="badge badge-dark">High</span>
              )}
            </p>
            <div style={{ letterSpacing: "2px", fontFamily: "monospace" }}>
              <b>Date: {"  "}</b>
              <Moment
                format="DD/MM/YY HH:mm"
                date={list.schedule.duedate}
                className="text-success"
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
            <h3>
              {note.title}
              <IconButton
                onClick={(e) => {
                  if (
                    window.confirm(
                      "Are you sure to delete this note? Action cannot be undone."
                    )
                  )
                    deleteTask(note._id);
                }}
              >
                <Delete color="secondary" />
              </IconButton>
            </h3>
            <p>
              {note.priority === 0 && (
                <span class="badge badge-warning">Low</span>
              )}
              {note.priority === 3 && (
                <span class="badge badge-secondary">Medium</span>
              )}
              {note.priority === 2 && (
                <span class="badge badge-danger">Urgent</span>
              )}
              {note.priority === 1 && (
                <span class="badge badge-dark">High</span>
              )}
            </p>
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
  auth: PropTypes.object.isRequired,
  getTeam: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  team: state.team,
  error: state.error,
});

export default connect(mapStateToProps, { getTeam })(ShowTeam);
