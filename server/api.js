const express = require("express");
const app = express();

const port = 4000;
const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
const io = require("socket.io")(server);

io.sockets.on("connection", function (socket) {

});
