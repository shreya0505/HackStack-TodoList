import React, { useState, useEffect, Fragment } from "react";

import axios from "axios";
import { getTeam } from "../../../actions/team";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./Chat.css";
import Message from "./Chatroom/Message";

import { TextField } from "@material-ui/core";

import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";

let socket;
const ENDPOINT = "localhost:5000";

const Chat = ({
  getTeam,
  match,
  team: { loading, project },
  error: { errors },
  auth: { user },
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    async function call_async() {
      await getTeam(match.params.id);
    }
    call_async();
  }, [match.params.id, getTeam]);
  useEffect(() => {
    const room = match.params.id;
    const name = user.username;
    console.log("running");
    socket = io(ENDPOINT);
    socket.emit("join", { name, room }, (name) => {
      setMembers((members) => [...members, name]);
      console.log(members)
    });
    return () => {
      socket.emit("disconnect");
      console.log("Bye!");
    };
    
  }, [user]);

  const sendMessage = (event, chatroom) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, user.username, chatroom);
      setMessage("");
    }
  };

  useEffect(() => {
    console.log("working");
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
      console.log(messages);
    });
  }, []);

  return loading ? (
    <div className="main-landing">
      <h1> Loading...</h1>
    </div>
  ) : (
    <Fragment>
      {" "}
      <div className="content" style={{ marginTop: "100px" }}>
        <h1 style={{ letterSpacing: "2px", marginBottom: "30px" }}>
          {project.teamName}'s Chatroom
        </h1>
        <div className="content">
          {members.map((member, i) => (
            <div key={i}>
              <p>{member}</p>
            </div>
          ))}
        </div>

        <div className="container">
          <ScrollToBottom className="messages">
            {messages.map((message, i) => (
              <div key={i}>
                <Message message={message} name={user.username} />
              </div>
            ))}
          </ScrollToBottom>
          <form className="form">
            <TextField
              className="input"
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={({ target: { value } }) => setMessage(value)}
              onKeyPress={(event) =>
                event.key === "Enter"
                  ? sendMessage(event, match.params.id)
                  : null
              }
            />
            <button
              className="sendButton"
              onClick={(e) => sendMessage(e, match.params.id)}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

Chat.propTypes = {
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

export default connect(mapStateToProps, { getTeam })(Chat);
