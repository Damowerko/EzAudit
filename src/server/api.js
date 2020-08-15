const express = require("express");
const app = express();

const port = 4000;
const http = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const io = require("socket.io")(http);

let mobile = null;
const sockets = [];

io.sockets.on("connection", function (socket) {
  if (!(socket in sockets)) {
    sockets.push(socket);
    console.log("New connection!");
  }
  socket.on("login", function (isMobile) {
    console.log(`Login: ${isMobile}`);
    if (isMobile) {
      mobile = socket;
    } else if (!mobile) {
      console.error("No host registered!");
    } else {
      mobile.emit("login", sockets.indexOf(socket));
    }
  });
  socket.on("message", function (data) {
    console.log(JSON.stringify(data));
    if (!mobile) {
      console.error("No host registered!");
      return;
    }
    if (mobile === socket) {
      const {recipient} = data;
      if (!recipient) {
        console.error("Need to specify a recipient.");
      } else if (!sockets[recipient]) {
        console.error("Invalid recipient.");
      } else {
        sockets[recipient].send(data);
      }
    } else {
      data.sender = sockets.indexOf(socket);
      mobile.send(data);
    }
  });
});
