const express = require("express");
const http = require("http");
const socket = require("socket.io");
var cors = require("cors");

const app = express();

// midllewares
app.use(cors());

const server = http.createServer(app);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signal,
      from: data.from,
    });
  });

  socket.on("answer", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  // socket.on("disconnect", () => {
  //   socket.brodcast.emit("callEnded");
  // });
});
server.listen(4000, () => console.log("server running on port 4000"));
