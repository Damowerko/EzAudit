const uuid = require("uuid");
const multer = require("multer");
const router = require("express").Router();
const fs = require("fs");
const mongoose = require("mongoose");
const {File} = require("models");

const FILES_DIR = "../../files";
const DB_URI =
  "mongodb+srv://admin:pQpbNv6tJs30r1Oq@ezaudit.jvmwz.mongodb.net/ezaudit?retryWrites=true&w=majority";

mongoose.connect(DB_URI, {useNewUrlParser: true});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, FILES_DIR);
    },
    filename(req, file, cb) {
      const extension = file.originalname.split(".").pop();
      cb(null, uuid.v4().toString() + "." + extension);
    },
  }),
});

router.post("/", upload.array("file"), async function (req, res) {
  let metadata = [];
  if (req.files) {
    for (const file of req.files) {
      const {filename, originalname} = file;
      const id = filename.split("_")[0];
      metadata.push({id, filename, originalname});
    }
  }
  await File.create(metadata).exec();
  res.send(metadata);
});

router
  .route("/:id")
  .all(async function (req, res, next) {
    const {id} = req.params;
    const file = await File.findOne({id}).exec();
    if (file) {
      req.existingFile = file;
      next();
    } else {
      throw new Error(`No file with id ${id}`);
    }
  })
  .get(async function (req, res) {
    res.download(req.existingFile.filename, req.existingFile.originalname, {
      root: FILES_DIR,
    });
  })
  .put(upload.single("file"), async function (req, res) {
    const {id} = req.params;
    await File.updateOne({id}, {originalname: req.file.originalname}).exec();
    fs.renameSync(
      FILES_DIR + res.file.filename,
      FILES_DIR + res.existingFile.filename,
    );
  });

router
  .route("/metadata/:id")
  .all(async function (req, res, next) {
    const {id} = req.params;
    if (!File.findOne({id})) {
      throw new Error(`No file with id ${id}`);
    }
    next();
  })
  .get(async function (req, res) {
    const {id} = req.params;
    const {filename, originalname} = await File.findOne({id});
    res.download(filename, originalname, {root: FILES_DIR});
  })
  .put(async function (req, res) {
    const {id} = req.params;
    if (req.body.id !== null || req.body.filename !== null) {
      throw new Error(
        "id and filename file metadata are not mutable by the client.",
      );
    }
    await File.updateOne({id}, req.body);
  });

module.exports = router;
