import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import useReactRouter from "use-react-router";

const UnNavbar = ({ auth, logout }) => {
  const [rooms, setRooms] = useState([]);
  const { history } = useReactRouter();

  const getUserRooms = () => {
    axios.get("http://127.0.0.1:7000/api/rooms").then((response) => {
      console.log(response);
      setRooms(response.data.results);
    });
  };

  const handleDropDownClick = (room) => {
    history.push(`/room/${room}`);
  };

  useEffect(() => {
    getUserRooms();
  }, []);

  const renderRoomOptions = () => {
    const options = [];
    if (rooms) {
      rooms.forEach((room) => {
        options.push(
          <MDBDropdownItem
            onClick={() => {
              history.push(`/room/${room.uuid}`);
            }}
          >
            {room.name}
          </MDBDropdownItem>
        );
      });
    }
    return options;
  };

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
        <strong className="white-text">Navbar</strong>
      </MDBNavbarBrand>

      <MDBNavbarNav left>
        <MDBNavItem active>
          <MDBNavLink to="/">Home</MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
          <MDBDropdown>
            <MDBDropdownToggle nav caret>
              <span className="mr-2">Rooms</span>
            </MDBDropdownToggle>
            <MDBDropdownMenu>{renderRoomOptions()}</MDBDropdownMenu>
          </MDBDropdown>
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
