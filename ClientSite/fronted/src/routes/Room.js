import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { MDBBtn, MDBCard, MDBIcon } from "mdbreact";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  ButtonGroup,
} from "reactstrap";
import useReactRouter from "use-react-router";

const StyledVideo = styled.video`
  width: 600px;
  height: 400px;
  display: block;
  margin: 0 auto;
`;

const Grid = styled.div`
  width: 95%;
  display: grid;
  grid-template-columns: 700px 700px;
  grid-gap: 3px;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const [mute, setMute] = useState(false);
  const [muted, setMuted] = useState(true);
  const [visible, setVisible] = useState(true);
  const [historyRoom, setHistoryRoom] = useState();
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  const [videoMap, setVideoMap] = useState({});
  const [micMap, setMicMap] = useState([]);
  const [chosenMic, setChosenMic] = useState("default");
  const [audioMap, setAudioMap] = useState({});
  const { buttonLabel, className } = props;
  const { history } = useReactRouter();

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const dissconect = () => {
    socketRef.current.emit("disconnect");
    socketRef.current.close();
    userVideo.current.srcObject.getTracks().forEach((track) => track.stop());
    socketRef.current.off();
    history.push("/");
  };

  useEffect(() => {
    setMaps();
  }, []);
  useEffect(() => {
    if (userVideo.current.srcObject) {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = visible;
    }
  }, [visible]);
  useEffect(() => {
    if (userVideo.current.srcObject) {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = muted;
    }
  }, [muted]);

  const setMaps = () => {
    const enumeratorPromise = navigator.mediaDevices.enumerateDevices();
    enumeratorPromise.then((devices) => {
      const init = {};
      setAudioMap(
        devices
          .filter((device) => {
            return device.kind === "audiooutput";
          })
          .reduce((obj, item) => {
            return {
              ...obj,
              [item.label]: item.deviceId,
            };
          }, init)
      );
      setVideoMap(
        devices
          .filter((device) => {
            return device.kind === "videoinput";
          })
          .reduce((obj, item) => {
            return {
              ...obj,
              [item.label]: item.deviceId,
            };
          }, init)
      );
      setMicMap(
        devices.filter((device) => {
          return device.kind === "audioinput";
        })
      );
    });
  };

  useEffect(() => {
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({
        video: videoConstraints,
        audio: true,
      })
      .then((stream) => {
        userVideo.current.srcObject = stream;

        console.log({ audio: { deviceId: { exact: chosenMic } } });
        socketRef.current.emit("join room", roomID);
        setHistoryRoom(roomID);
        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });
        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });

    socketRef.current.on("user left", (payload) => {
      let array = payload;
      array.shift();
      setPeers(array);
    });
    socketRef.current.on("user change", (payload) => {
      let array = payload;
      console.log("user change");
      array.shift();
      setPeers(array);
    });

    return () => {
      socketRef.current.emit("disconnect");
      socketRef.current.close();
      userVideo.current.srcObject.getTracks().forEach((track) => track.stop());
      socketRef.current.off();
    };
  }, [, roomID]);

  useEffect(() => {
    console.log(historyRoom, roomID);
    if (historyRoom) {
      if (historyRoom !== roomID) {
        console.log(historyRoom, roomID);
        socketRef.current.emit("disconnect");
        socketRef.current.on("user left", (payload) => {
          let array = payload;
          array.shift();
          setPeers(array);
        });
      }
    }
  }, [props.location.search, roomID]);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  const handleSelfOnClick = () => {
    setMuted(!muted);
  };

  const handleVideoOnClick = () => {
    setVisible(!visible);
  };
  const handleVideoColor = () => {
    if (visible === true) {
      return "primary";
    } else {
      return "danger";
    }
  };
  const handleColor = () => {
    if (muted === true) {
      return "primary";
    } else {
      return "danger";
    }
  };

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div>
      <h3>
        Copy the room name :
        <Button
          color="primary"
          onClick={() => {
            navigator.clipboard.writeText(roomID);
          }}
          className="w-25"
          size="sm"
        >
          <MDBIcon icon="copy" className="mr-2"></MDBIcon>
          {roomID}
        </Button>
      </h3>
      <Grid>
        <MDBCard style={{ width: "605px", height: "450px" }}>
          <StyledVideo muted ref={userVideo} autoPlay playsInline />
          <ButtonGroup>
            <Button
              color={`${handleColor()}`}
              onClick={handleSelfOnClick}
              className="w-25 d-flex justify-content-center"
              size="sm"
            >
              <MDBIcon icon="microphone" className="mr-2"></MDBIcon>
              {muted ? "Mute" : "Unmute"}
            </Button>
            <Button
              color="danger"
              onClick={toggle}
              className="w-25 d-flex justify-content-center"
              size="sm"
            >
              <MDBIcon icon="phone-slash" className="mr-2"></MDBIcon>
              Disconnect
            </Button>
            <Button
              color={`${handleVideoColor()}`}
              onClick={handleVideoOnClick}
              className="w-25 d-flex justify-content-center"
              size="sm"
            >
              <MDBIcon icon="video" className="mr-2"></MDBIcon>
              {visible ? "Camera turned on" : "Camera turned off"}
            </Button>
          </ButtonGroup>
          <Modal isOpen={modal} toggle={toggle} className={className}>
            <ModalHeader toggle={toggle}>Disconnecting</ModalHeader>
            <ModalBody>Do you want to disconnect ?</ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={dissconect}>
                Disconnect
              </Button>
              <Button color="primary" onClick={toggle}>
                Back
              </Button>
            </ModalFooter>
          </Modal>
        </MDBCard>
        {peers.map((peer, index) => {
          return (
            <MDBCard style={{ width: "605px", height: "450px" }}>
              <Video muted={mute} key={index} peer={peer} />
            </MDBCard>
          );
        })}
      </Grid>
    </div>
  );
};

export default Room;
