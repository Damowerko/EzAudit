const http = require("http");
const express = require("express");
const api = require("./api");
const mongoose = require("mongoose");
const ConferenceServer = require("../conference/ConferenceServer");
const cors = require('cors');

const DB_URI =
  "mongodb+srv://admin:pQpbNv6tJs30r1Oq@ezaudit.jvmwz.mongodb.net/ezaudit?retryWrites=true&w=majority";
const PORT = 4000;

const app = express();
const server = http.createServer(app);
mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(cors());

app.use("/api", api);
new ConferenceServer(server);

server.listen(PORT, () => console.log(`Listening on *:${PORT}`));
