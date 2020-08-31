const MongoClient = require("mongodb");
const express = require("express");
const router = require("express").Router();
const {runAsync} = require("./util");

const DB_URI =
  "mongodb+srv://admin:pQpbNv6tJs30r1Oq@ezaudit.jvmwz.mongodb.net/ezaudit?retryWrites=true&w=majority";

const collectionNames = [
  "certificateAttachment",
  "certificate",
  "cocCompanySite",
  "contacts",
  "countryData",
  "evaluation",
  "licenseAgreement",
  "organization",
  "productSpecies",
  "product",
  "species",
  "adviceBackgroundGraphics",
  "adviceTermsDefinitionsGraphics",
  "advicesAmended",
  "advicesElements",
  "advices",
  "cocScenariosFilter",
  "cocScenarios",
  "directives",
  "requirementType",
  "requirmentTypePerCocScenarioStd",
  "standardsElementsAdvices",
  "standardsElementsLinks",
  "standardsElements",
  "standards",
];

(async function () {
  const url = "mongodb://localhost:27017/myproject";
  let client;
  try {
    client = await MongoClient.connect(DB_URI);
  } catch (err) {
    console.error(err);
  }
  const db = client.db("ezaudit");

  router
    .route("/:collection")
    .all(
      runAsync(async function (req, res, next) {
        const {collection} = req.params;
        if (!collectionNames.includes(collection))
          throw new Error(`${collection} is not a valid fsc resource.`);
        req.collection = db.collection(collection);
        next();
      }),
    )
    .all(express.json())
    .get(
      runAsync(async function (req, res) {
        const result = await req.collection.find(req.body).toArray();
        res.setHeader("Content-Type", "application/json");
        res.send(result);
      }),
    );
})();

module.exports = router;
