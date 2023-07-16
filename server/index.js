const express = require("express");
const cors = require("cors");
const http = require("http");
const socketInstance = require("socket.io");

const app = express();

// middlewares
app.use(cors());

const server = http.createServer(app);

const io = socketInstance(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // console.log(socket.id);

  // sending socket id
  socket.emit("myid", socket.id);

  // call user
  socket.on("calluser", (data) => {
    io.to(data.userToCall).emit("calluser", {
      from: data.from,
      signal: data.signal,
    });
  });

  // answer call
  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });
  socket.on("endcall", (data) => {
    io.to(data.to).emit("endcall", {
      endedCall: data.endedCall,
    });
  });
});

server.listen(4000, () => console.log("server is listening on 4000"));
