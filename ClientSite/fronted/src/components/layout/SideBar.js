import React, { useState, useEffect } from "react";
import { NavItem, NavLink, Nav } from "reactstrap";
import classNames from "classnames";
import axios from "axios";
import { v1 as uuid } from "uuid";
import useReactRouter from "use-react-router";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, ButtonGroup } from "reactstrap";

const SideBar = ({ isAuthenticated }) => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [flag, setFlag] = useState(false);
  const { history } = useReactRouter();

  const getUserRooms = () => {
    axios.get("http://192.168.195.1:7000/api/rooms").then((response) => {
      console.log(response);
      setRooms(response.data.results);
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (roomName !== "") {
      const room = { uuid: uuid(), name: roomName };
      console.log(roomName);
      axios
        .post("http://192.168.195.1:7000/api/rooms", room)
        .then((response) => {});
    }
    setFlag(!flag);
    setRoomName("");
    setFlag(!flag);
    setFlag(!flag);
  };

  const onClick = (room) => {
    history.push(`/`);
    history.replace(`/room/${room}`);
  };

  useEffect(() => {
    console.log("useeffect", flag);
    getUserRooms();
  }, [, flag]);

  const renderRoomOptions = () => {
    const options = [];
    if (rooms) {
      rooms.forEach((room) => {
        options.push(
          <NavItem>
            <NavLink onClick={() => onClick(room.uuid)}>{room.name}</NavLink>
          </NavItem>
        );
      });
    }
    return options;
  };

  const conditionalRender = () => {
    if (isAuthenticated) {
      return (
        <div className={classNames("sidebar", { "is-open": true })}>
          <div className="sidebar-header">
            <span color="info" style={{ color: "#fff" }}>
              &times;
            </span>
          </div>
          <div className="side-menu">
            <form onSubmit={onSubmit}>
              <label>Create new room</label>
              <input
                type="text"
                className="form-control"
                name="username"
                onChange={(e) => setRoomName(e.target.value)}
                value={roomName}
              />
              <ButtonGroup>
                <Button type="submit" color="primary">
                  Create
                </Button>
                <Button color="primary" onClick={getUserRooms}>
                  Refresh
                </Button>
              </ButtonGroup>
            </form>
            <label>Existing rooms</label>
            <Nav vertical className="list-unstyled pb-3">
              {renderRoomOptions()}
            </Nav>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return conditionalRender();
};
SideBar.propTypes = {
  isAuthenticated: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(SideBar);
