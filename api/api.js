const express = require("express");
const app = express();
const port = 4000;
const socketApp = express();
const socketHttp = require("http").createServer(socketApp);
const socketPort = 4001;

app.get("/", function (req, res) {
  res.send("api todo");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

socketHttp.listen(socketPort, () => {
  console.log(`Socket.io is listening at http://localhost:${socketPort}`);
});