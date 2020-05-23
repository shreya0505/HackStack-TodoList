import React, { useEffect } from "react";
import { getActivity } from "../../../actions/team";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
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
  Edit,
} from "@material-ui/icons";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  withStyles,
  makeStyles,
  Tooltip,
} from "@material-ui/core";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const AcitivityLogs = ({
  getActivity,
  match,
  team: { loading, activity },
  error: { errors },
}) => {
  useEffect(() => {
    getActivity(match.params.id);
    console.log("hehrejh", activity)
  }, [match.params.id, getActivity]);
  const classes = useStyles();

  return activity===null ? (
    <div className="landing-content">
      <h1></h1>Loading
    </div>
  ) : (
    <div className="landing-content">
      <h1 style={{ marginBottom: "50px", textAlign: "center" }}>
        Activity Logger
      </h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Time</StyledTableCell>

              <StyledTableCell align="center">Action</StyledTableCell>
              <StyledTableCell align="center">Item</StyledTableCell>
              <StyledTableCell align="center">Link</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activity.map((act) => (
              <StyledTableRow key={act._id}>
                <StyledTableCell align="right">
                  <span
                    style={{
                      letterSpacing: "2px",
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    <Moment format="DD/MM/YY HH:mm" date={act.time} />
                  </span>
                </StyledTableCell>
                <StyledTableCell align="right">
                  {act.action === "post" && (
                    <span class="badge badge-pill badge-success">
                      {act.action}
                    </span>
                  )}
                  {act.action === "delete" && (
                    <span class="badge badge-pill badge-danger">
                      {act.action}
                    </span>
                  )}
                  {act.action === "update" && (
                    <span class="badge badge-pill badge-info">
                      {act.action}
                    </span>
                  )}
                  {act.action === "joined" && (
                    <span class="badge badge-pill badge-primary">
                      {act.action}
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {act.target === "task" && <AssignmentTurnedIn />}
                  {act.target === "stickynotes" && <DashboardRounded />}
                  {act.target === "checklist" && <Check />}
                  {act.target === "welcome" && <GroupAdd />}
                  {act.target === "project" && <Edit />}
                  {act.target === "schedule" && <Event />}
                </StyledTableCell>
                <StyledTableCell align="right">{act.targetid}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

AcitivityLogs.propTypes = {
  error: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
  getActivity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  team: state.team,
  error: state.error,
});
export default connect(mapStateToProps, { getActivity })(AcitivityLogs);
