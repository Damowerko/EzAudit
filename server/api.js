const express = require("express");
const app = express();

const port = 4000;
const http = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const io = require("socket.io")(http);

io.sockets.on("connection", function (socket) {
  console.log(`Connection!`);
  socket.on("answer", function (data) {
    console.log(`Answer: ${JSON.stringify(data)}`);
    io.emit("answer", data);
  });

  socket.on("offer", function (data) {
    console.log(`Offer: ${JSON.stringify(data)}`);
    io.emit("offer", data);
  });
});
