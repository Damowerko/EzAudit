const Database = require("./Database.js");
const router = require("express").Router();
const files = require("src/server/file");

router.get("/", function (req, res) {
  res.send("<h1>Hello world!</h1>");
});

router.use("/file", files);

router.module.exports = router;
