import React, { useState, useEffect, Fragment } from "react";

import axios from "axios";
import { getTeam } from "../../../actions/team";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./Chat.css";
import Message from "./Chatroom/Message";
import SendIcon from "@material-ui/icons/Send";

import { TextField, IconButton } from "@material-ui/core";

import io from "socket.io-client";

let socket;
const ENDPOINT = "localhost:5000";

const getChats = async (id) => {
  try {
    const res = await axios.get(`/team/chat/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const Chat = ({
  getTeam,
  match,
  team: { loading, project },
  error: { errors },
  auth: { user },
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function call_async() {
      await getTeam(match.params.id);
      const payload = await getChats(match.params.id);
      setChats(payload);
    }
    call_async();
  }, [match.params.id, getTeam]);
  useEffect(() => {
    const room = match.params.id;
    const name = user.username;
    console.log("running");
    socket = io(ENDPOINT);
    socket.emit("join", { name, room }, (name) => {});
    return () => {
      socket.emit("disconnect");
      console.log("Bye!");
    };
  }, [user]);

  const sendMessage = async (event, chatroom) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, user.username, chatroom);
      setMessage("");
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const sender = user.username;
      const text = message;
      const body = JSON.stringify({
        sender,
        text,
      });
      try {
        const res = await axios.post(
          `/team/chat/${match.params.id}`,
          body,
          config
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    console.log("working");
    socket.on("message", (message) => {
      setMessages((messages) => [message, ...messages]);
      console.log(messages);
    });
  }, []);

  return loading ? (
    <div className="main-landing">
      <h1> Loading...</h1>
    </div>
  ) : (
    <Fragment>
      <div className="content" style={{ marginTop: "100px" }}>
        <h1 style={{ letterSpacing: "2px", marginBottom: "30px" }}>
          {project.teamName}'s Chatroom
        </h1>
        <form className="form">
          <TextField
            className="input"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={({ target: { value } }) => setMessage(value)}
            onKeyPress={(event) =>
              event.key === "Enter" ? sendMessage(event, match.params.id) : null
            }
          />
          <IconButton
            style={{ marginLeft: "20px" }}
            className="sendButton"
            onClick={(e) => sendMessage(e, match.params.id)}
          >
            <SendIcon color="secondary" />
          </IconButton>
        </form>

        <div className="container">
          <div className="messages">
            {messages.map((message, i) => (
              <div key={i} style={{ marginTop: "10px" }}>
                <Message message={message} name={user.username} />
              </div>
            ))}
          </div>
        </div>
        <div className="container">
          <div className="messages">
            {chats.map((message, i) => (
              <div key={i} style={{ marginTop: "10px" }}>
                <Message message={message.text} name={message.sender} />
              </div>
            ))}
          </div>
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
