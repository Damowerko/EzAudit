const http = require("http");
const express = require("express");
const ConferenceServer = require("../conference/ConferenceServer");

const PORT = 4000;

const app = express();
const server = http.createServer(app);

new ConferenceServer(server);

app.get("/api", function (req, res) {
  res.send("<h1>Hello world!</h1>");
});

server.listen(PORT, () => console.log(`Listening on *:${PORT}`));