const http = require("http");
const express = require("express");
const api = require("api");

const ConferenceServer = require("../conference/ConferenceServer");

const PORT = 4000;

const app = express();
const server = http.createServer(app);

app.use("/api", api);
const conferenceServer = new ConferenceServer(server);

server.listen(PORT, () => console.log(`Listening on *:${PORT}`));
