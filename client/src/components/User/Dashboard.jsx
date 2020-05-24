import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Group,
  Event,
  Assignment,
  ImportExport,
  Check,
  DashboardRounded,
  AssignmentTurnedIn,
  Add,
  PersonPin,
  LibraryBooksOutlined,
  GroupAdd,
} from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

const Dashboard = ({ auth: { user, loading } }) => {
  return loading ? (
    <div>
      <h1 className="landing-content"> Loading...</h1>
    </div>
  ) : (
    <Fragment>
      <div className="maincontent">
        <h1>Dashboard</h1>
        <hr></hr>
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
              <h4>Actions</h4>
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
                <Assignment />
                &nbsp;&nbsp;Self Project&nbsp;{" "}
                <span class="badge badge-info">{user.personal.length}</span>
              </button>
              <button
                onClick={() => (window.location.href = "/addTeamProject")}
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
                <Group />
                &nbsp; Team Project &nbsp;
                <span class="badge badge-info badge-small">
                  {user.team.length}
                </span>
              </button>
              <button
                onClick={() => (window.location.href = "/join")}
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
                &nbsp;&nbsp;Join Team&nbsp;{" "}
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
              <h4>Filter Projects </h4>
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
        <hr></hr>
        <div style={{ marginTop: "50px", marginBottom: "50px" }}>
          <h3>
            Perosnal Projects{" "}
            <IconButton onClick={() => (window.location.href = "/addProject")}>
              <Add color="primary" />
            </IconButton>
          </h3>
          <div className="container" style={{ marginTop: "30px" }}>
            <div className="row">
              {user.personal.map((personal) => (
                <div key={personal._id} className="col-lg-6 col-sm-12">
                  <Link
                    to={`/viewPersonal/${personal._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        padding: "20px 20px",
                        margin: "10px 10px",
                        textAlign: "center",
                        color: "#141517",
                        overflow: "hidden",
                        textAlign: "left",
                      }}
                      className="border rounded"
                    >
                      <h4>{personal.title}</h4>
                      <div style={{ textAlign: "center" }}>
                        <button
                          class="btn btn-light btn-lg"
                          style={{
                            letterSpacing: "2px",
                            marginTop: "20px",
                            width: "100%",
                            fontFamily: "Roboto, sans-serif",
                            color: "#2c2e2e",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          <AssignmentTurnedIn />
                          &nbsp;&nbsp;Tasks
                          <span
                            class="badge badge-info"
                            style={{ float: "right" }}
                          >
                            {personal.task.length}
                          </span>
                        </button>
                        <button
                          class="btn btn-light btn-lg"
                          style={{
                            letterSpacing: "2px",
                            marginTop: "20px",
                            width: "100%",
                            fontFamily: "Roboto, sans-serif",
                            color: "#2c2e2e",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          <Check />
                          &nbsp;&nbsp;Checklists
                          <span
                            class="badge badge-info"
                            style={{ float: "right" }}
                          >
                            {personal.checklist.length}
                          </span>
                        </button>
                        <button
                          class="btn btn-light btn-lg"
                          style={{
                            letterSpacing: "2px",
                            marginTop: "20px",
                            width: "100%",
                            fontFamily: "Roboto, sans-serif",
                            color: "#2c2e2e",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          <DashboardRounded />
                          &nbsp;&nbsp;Sticky Notes
                          <span
                            class="badge badge-info"
                            style={{ float: "right" }}
                          >
                            {personal.notes.length}
                          </span>
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr></hr>
        <div style={{ marginTop: "50px", marginBottom: "50px" }}>
          <h3>
            Team Projects{" "}
            <IconButton
              onClick={() => (window.location.href = "/addTeamProject")}
            >
              <Add color="primary" />
            </IconButton>
          </h3>
          <div className="container" style={{ marginTop: "30px" }}>
            <div className="row">
              {user.team.map((team) => (
                <div key={team._id} className="col-lg-6 col-sm-12">
                  <Link
                    to={`/viewTeam/${team._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        padding: "20px 20px",
                        margin: "10px 10px",
                        textAlign: "center",
                        color: "#141517",
                        overflow: "hidden",
                        textAlign: "left",
                      }}
                      className="border rounded"
                    >
                      <h4>{team.title}</h4>
                      <div style={{ textAlign: "center" }}>
                        <button
                          class="btn btn-light btn-lg"
                          style={{
                            letterSpacing: "2px",
                            marginTop: "20px",
                            width: "100%",
                            fontFamily: "Roboto, sans-serif",
                            color: "#2c2e2e",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          <PersonPin />
                          &nbsp;&nbsp;{team.managerName}
                          <span
                            class="badge badge-info"
                            style={{ float: "right" }}
                          >
                            M
                          </span>
                        </button>

                        <button
                          class="btn btn-light btn-lg"
                          style={{
                            letterSpacing: "2px",
                            marginTop: "20px",
                            width: "100%",
                            fontFamily: "Roboto, sans-serif",
                            color: "#2c2e2e",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          <Group />
                          &nbsp;&nbsp;Members
                          <span
                            class="badge badge-info"
                            style={{ float: "right" }}
                          >
                            {team.teamMembers.length}
                          </span>
                        </button>
                        <button
                          class="btn btn-light btn-lg"
                          style={{
                            letterSpacing: "2px",
                            marginTop: "20px",
                            width: "100%",
                            fontFamily: "Roboto, sans-serif",
                            color: "#2c2e2e",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          <LibraryBooksOutlined />
                          &nbsp;&nbsp;Activity Logs
                          <span
                            class="badge badge-info"
                            style={{ float: "right" }}
                          >
                            {team.activityLog.length}
                          </span>
                        </button>
                        <button
                          class="btn btn-light btn-lg"
                          style={{
                            letterSpacing: "2px",
                            marginTop: "20px",
                            width: "100%",
                            fontFamily: "Roboto, sans-serif",
                            color: "#2c2e2e",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          <AssignmentTurnedIn />
                          &nbsp;&nbsp;Tasks
                          <span
                            class="badge badge-info"
                            style={{ float: "right" }}
                          >
                            {team.task.length}
                          </span>
                        </button>
                        <button
                          class="btn btn-light btn-lg"
                          style={{
                            letterSpacing: "2px",
                            marginTop: "20px",
                            width: "100%",
                            fontFamily: "Roboto, sans-serif",
                            color: "#2c2e2e",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          <Check />
                          &nbsp;&nbsp;Checklists
                          <span
                            class="badge badge-info"
                            style={{ float: "right" }}
                          >
                            {team.checklist.length}
                          </span>
                        </button>
                        <button
                          class="btn btn-light btn-lg"
                          style={{
                            letterSpacing: "2px",
                            marginTop: "20px",
                            width: "100%",
                            fontFamily: "Roboto, sans-serif",
                            color: "#2c2e2e",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          <DashboardRounded />
                          &nbsp;&nbsp;Sticky Notes
                          <span
                            class="badge badge-info"
                            style={{ float: "right" }}
                          >
                            {team.notes.length}
                          </span>
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  pboards: state.pboards,
});

export default connect(mapStateToProps, {})(Dashboard);
