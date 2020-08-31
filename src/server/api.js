const router = require("express").Router();
const files = require("./file");
const fsc = require("./fsc");

router.get("/", function (req, res) {
  res.send("<h1>Hello world!</h1>");
});

router.use("/file", files);
router.use("/fsc", fsc);

module.exports = router;