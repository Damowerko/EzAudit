const uuid = require("uuid");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const util = require("util");
const {File} = require("./models");

const FILES_DIR = path.join(__dirname, "../../files");

function runAsync(callback) {
  return function (req, res, next) {
    callback(req, res, next).catch(next);
  };
}

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

function getFile() {
  return runAsync(async function (req, res, next) {
    const {_id} = req.params;
    const file = await File.findOne({_id}).exec();
    if (file) {
      req.db = {file};
      next();
    } else {
      throw new Error(`No file with id ${_id}`);
    }
  });
}

router
  // get all files
  .route("/")
  .get(
    runAsync(async function (req, res) {
      const files = await File.find().sort('-date');

      return res.send({files})
    })
  )

router
  .route("/:_id?")
  .post(
    upload.array("file"),
    runAsync(async function (req, res) {
      let files = [];
      if (req.file) {
        files.push(req.file);
      } else if (req.files) {
        files = req.files;
      } else {
        throw Error("No file uploaded.");
      }
      const metadata = files.map(function (file) {
        const {filename, originalname} = file;
        return {filename, originalname};
      });
      res.send(await File.create(metadata));
    }),
  )
  .get(
    runAsync(async function (req, res, next) {
      if(req.params._id !== undefined) {
        next();
      } else {
        res.send(await File.find());
      }
    }),
    getFile(),
    runAsync(async function (req, res) {
      res.download(
        path.join(FILES_DIR, req.db.file.filename),
        req.db.file.originalname,
      );
    }),
  )
  .put(
    getFile(),
    upload.single("file"),
    runAsync(async function (req, res) {
      req.db.file.originalname = req.file.originalname;
      await req.db.file.save();
      await util.promisify(fs.rename)(
        path.join(FILES_DIR, req.file.filename),
        path.join(FILES_DIR, req.db.file.filename),
      );
      res.sendStatus(200);
    }),
  );

router
  .route("/:_id/comment/:commentId?")
  .all(getFile())
  .post(
    express.json(),
    runAsync(async function (req, res) {
      const {file} = req.db;
      file.comments.push(req.body);
      const data = await file.save();
      res.send(data);
    }),
  )
  .get(
    runAsync(async function (req, res) {
      const {file} = req.db;
      res.send(file.comments);
    }),
  )
  .delete(
    runAsync(async function (req, res) {
      const {file} = req.db;
      const {commentId} = req.params;
      if (commentId !== undefined) {
        file.comments.pull(commentId);
        await file.save();
        res.sendStatus(200);
      } else {
        throw Error("Must specify comment id to delete.");
      }
    }),
  );

router
  .route("/:id/metadata")
  .all(getFile())
  .get(
    runAsync(async function (req, res) {
      res.send(req.db.file);
    }),
  )
  .put(
    express.json(),
    runAsync(async function (req, res) {
      if (req.body._id !== undefined || req.body.filename !== undefined) {
        throw new Error(
          "_id and filename file metadata are not mutable by the client.",
        );
      }
      Object.assign(req.db.file, req.body);
      await req.db.file.save();
      res.sendStatus(200);
    }),
  );

module.exports = router;
