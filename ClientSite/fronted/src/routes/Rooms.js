import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MDBNav, MDBNavLink, MDBContainer, MDBRow, MDBCol } from "mdbreact";
import { BrowserRouter as Router } from "react-router-dom";

const Rooms = ({ auth }) => {
  const [userRooms, setUserRooms] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:7000/api/rooms").then((response) => {
      setUserRooms(response.results);
    });
  }, []);

  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol>
          <MDBNav
            color="blue-gradient"
            className="flex-column font-weight-bold"
          >
            <MDBNavLink className="white-text" active to="#!">
              Active
            </MDBNavLink>
            <MDBNavLink className="white-text" to="#!">
              Link 1
            </MDBNavLink>
            <MDBNavLink className="white-text" to="#!">
              Link 2
            </MDBNavLink>
            <MDBNavLink className="white-text" to="#!">
              Link 3
            </MDBNavLink>
          </MDBNav>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

Rooms.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Rooms);
