import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";

export const Navbar = ({ logout, auth: { isAuthenticated } }) => {
  return (
    <div>
      <nav>
        <span style={{ margin: "5px 15px" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                letterSpacing: "3px",
                display: "inlineBlock",
                color: "grey",
                fontSize: "1.2rem",
                marginLeft: "10px",
              }}
            >
              TODOMO
            </span>
          </Link>
        </span>
        {isAuthenticated && (
          <span>
            <button
              class="btn btn-link"
              style={{
                textDecoration: "none",
                float: "right",
                display: "inlineBlock",
                color: "grey",
                letterSpacing: "1.5px",
              }}
              onClick={(e) => logout()}
            >
              {" "}
              LOGOUT{" "}
            </button>
          </span>
        )}
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

export default connect(mapStateToProps, { logout })(Navbar);
