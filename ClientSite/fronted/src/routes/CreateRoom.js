import React, { useState } from "react";
import { v1 as uuid } from "uuid";
import {
  MDBBtn,
  MDBCol,
  MDBCardTitle,
  MDBJumbotron,
  MDBContainer,
  MDBRow,
  MDBIcon,
} from "mdbreact";

const CreateRoom = (props) => {
  const [roomID, setRoomID] = useState("");

  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    props.history.push(`/room/${roomID}`);
  };

  return (
    <body style={{ paddingBottom: "60px" }}>
      <MDBContainer>
        <MDBRow>
          <MDBCol>
            <MDBJumbotron style={{ padding: 0 }}>
              <MDBCol
                className="text-white text-center py-5 px-4 my-5"
                style={{
                  backgroundImage: `url(https://mdbootstrap.com/img/Photos/Others/gradient1.jpg)`,
                }}
              >
                <MDBCol className="py-5">
                  <MDBCardTitle className="h1-responsive pt-3 m-5 font-bold">
                    Create new room that you can share with your friends
                  </MDBCardTitle>
                  <p className="mx-5 mb-5">
                    Start the easy and fast conversation with up to 4 users in
                    one room, just click the button bellow and share the created
                    link.
                  </p>
                  <MDBBtn
                    outline
                    onClick={create}
                    color="white"
                    className="mb-5"
                  >
                    <MDBIcon icon="headphones" className="mr-2"></MDBIcon>{" "}
                    Create quick room
                  </MDBBtn>
                  <form onSubmit={onSubmit}>
                    <label>Join to existiong room</label>
                    <input
                      type="text"
                      className="form-control"
                      name="roomID"
                      placeholder="Write room ID here"
                      onChange={(e) => setRoomID(e.target.value)}
                      value={roomID}
                    />
                    <MDBBtn
                      outline
                      type={"submit"}
                      color="white"
                      className="mb-5"
                    >
                      <MDBIcon icon="headphones" className="mr-2"></MDBIcon>{" "}
                      Join
                    </MDBBtn>
                  </form>
                </MDBCol>
              </MDBCol>
            </MDBJumbotron>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <footer
        style={{ position: "fixed", left: 0, bottom: 0, right: 0 }}
        className="page-footer font-small unique-color-dark pt-4"
      >
        <div className="footer-copyright text-center py-3">
          Created by:
          <a href="https://mdbootstrap.com/">
            {" "}
            Jakub Florczak, Przemysław Woźny
          </a>
        </div>
      </footer>
    </body>
  );
};

export default CreateRoom;
