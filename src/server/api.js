const router = require("express").Router();
const files = require("./file");

router.get("/", function (req, res) {
  res.send("<h1>Hello world!</h1>");
});

router.use("/file", files);

module.exports = router;