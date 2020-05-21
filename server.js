const express = require("express");
const connectDB = require("./config/db");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

connectDB();

const passport = require("passport");
const passportSetup = require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

//Init Middleware body parser
app.use(express.json({ extended: false }));
app.get("/", (req, res) => res.send("API RUNNING"));

//define route
app.use("/auth", require("./routes/auth"));
app.use("/personal", require("./routes/personal"));
app.use("/team", require("./routes/team"));

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("we have a connection");

  socket.on("join", ({ name, room }) => {
    console.log(name, room);
    socket.join(room);

    socket.emit("message", {
      sender: "admin",
      text: `${name}, welcome to chatroom.`,
    });

    socket.broadcast
      .to(room)
      .emit("message", { sender: "admin", text: `${name} has joined!` });
  });

  socket.on("sendMessage", (message, sender, chatroom) => {
    console.log(message, sender, chatroom);
    io.to(chatroom).emit("message", { sender: sender, text: message });
  });

  socket.on("disconnect", () => {
    console.log("User has left");
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
