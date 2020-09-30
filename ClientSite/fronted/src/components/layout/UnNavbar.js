import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import axios from "axios";

const UnNavbar = ({ auth, logout }) => {
  const { isAuthenticated, user } = auth;
  const authLinks = (
    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
      <span className="navbar-text mr-3">
        <strong>{user ? `Welcome ${user.username}` : ""}</strong>
      </span>
      <li className="nav-item">
        <button
          onClick={logout}
          className="nav-link btn btn-info btn-sm text-light"
        >
          Logout
        </button>
      </li>
    </ul>
  );

  const guestLinks = (
    <MDBNavbarNav>
      <MDBNavItem active>
        <MDBNavLink to="/register">Register</MDBNavLink>
      </MDBNavItem>
      <MDBNavItem active>
        <MDBNavLink to="/login">Login</MDBNavLink>
      </MDBNavItem>
    </MDBNavbarNav>
  );

  return (
    <MDBNavbar color="indigo" dark expand="md">
      <MDBNavbarBrand>
        <strong className="white-text">VoiceChat</strong>
      </MDBNavbarBrand>

      <MDBNavbarNav left>
        <MDBNavItem active>
          <MDBNavLink to="/">Home</MDBNavLink>
        </MDBNavItem>
      </MDBNavbarNav>
      <MDBNavbarNav right>
        <div className="md-form my-0">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </MDBNavbarNav>
    </MDBNavbar>
  );
};

UnNavbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logout })(UnNavbar);
