const router = require("express").Router();
const files = require("./file");
const fsc = require("./fsc");
const {runAsync} = require("./util");
const {generateCertificate, generateLicense} = require("./documentGeneration");
const docusign = require("docusign-esign");
const path = require("path");
const fs = require("fs");
const {promisify} = require("util"); // http://2ality.com/2017/05/util-promisify.html
const basePath = "https://demo.docusign.net/restapi";
const envir = require("dotenv").config();

router.get("/", function (req, res) {
  res.send("<h1>Hello world!</h1>");
});

router.use("/file", files);
router.use("/fsc", fsc);

router.get(
  "/license",
  runAsync(async function (req, res) {
    const pdf = await generateLicense(
      "Foo Enterprices",
      "3000 Potato Street, Philadlephia, PA 19104",
      "Mr. Potato Head",
    );
    res.setHeader("Content-Length", pdf.length);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "filename=Agreement.pdf");
    res.send(new Buffer(pdf));
  }),
);

router.get(
  "/certificate",
  runAsync(async function (req, res) {
    const pdf = await generateCertificate(
      "Foo Enterprices",
      "3000 Potato Street, Philadlephia, PA 19104",
      "Mr. Potato Head",
    );
    res.setHeader("Content-Length", pdf.length);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "filename=Certificate.pdf");
    res.send(new Buffer(pdf));
  }),
);

async function sendEnvelopeController(req, res) {
  const qp = req.query;
  // Fill in these constants or use query parameters of ACCESS_TOKEN, ACCOUNT_ID, USER_FULLNAME, USER_EMAIL
  // or environment variables.

  // Obtain an OAuth token from https://developers.hqtest.tst/oauth-token-generator
  const accessToken =
    envir.ACCESS_TOKEN ||
    qp.ACCESS_TOKEN ||
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjY4MTg1ZmYxLTRlNTEtNGNlOS1hZjFjLTY4OTgxMjIwMzMxNyJ9.eyJUb2tlblR5cGUiOjUsIklzc3VlSW5zdGFudCI6MTU5ODg5MTUxNCwiZXhwIjoxNTk4OTIwMzE0LCJVc2VySWQiOiJmNDA1YTkwMy02MWUzLTQ4MzYtYmY3Zi1lYTFhODljZjlkZWQiLCJzaXRlaWQiOjEsInNjcCI6WyJzaWduYXR1cmUiLCJjbGljay5tYW5hZ2UiLCJvcmdhbml6YXRpb25fcmVhZCIsInJvb21fZm9ybXMiLCJncm91cF9yZWFkIiwicGVybWlzc2lvbl9yZWFkIiwidXNlcl9yZWFkIiwidXNlcl93cml0ZSIsImFjY291bnRfcmVhZCIsImRvbWFpbl9yZWFkIiwiaWRlbnRpdHlfcHJvdmlkZXJfcmVhZCIsImR0ci5yb29tcy5yZWFkIiwiZHRyLnJvb21zLndyaXRlIiwiZHRyLmRvY3VtZW50cy5yZWFkIiwiZHRyLmRvY3VtZW50cy53cml0ZSIsImR0ci5wcm9maWxlLnJlYWQiLCJkdHIucHJvZmlsZS53cml0ZSIsImR0ci5jb21wYW55LnJlYWQiLCJkdHIuY29tcGFueS53cml0ZSJdLCJhdWQiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJhenAiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJpc3MiOiJodHRwczovL2FjY291bnQtZC5kb2N1c2lnbi5jb20vIiwic3ViIjoiZjQwNWE5MDMtNjFlMy00ODM2LWJmN2YtZWExYTg5Y2Y5ZGVkIiwiYW1yIjpbImludGVyYWN0aXZlIl0sImF1dGhfdGltZSI6MTU5ODg5MTUxMSwicHdpZCI6IjE2OWEyZjNmLWE5ZTktNGI3ZS05MzNkLWI1YWEwODlkYmYwNyJ9.tElwR7Wk_QLjK7WVv62A1PrpympHfb4WJMWjmbPHxwlvMaA2ZTfsEIBKvA9nm0Q57D0TXUfDA0_oouW9dxrUKglCYOKr-sGc5pAdPFj3exMmCBi47KRbSiDeY7YdtssAwF0Gm50mGJTYf9a6YzHfREUYcfuvNWDxXCXDA18ak9rGWWu-YbZYbhgsSo17bmBY0p2wC8LyMfSQwi-EbJzZZrsdYvHDBHAQ_toxbuU1VIq_OsjJsPGaucvHDEmAWwVW-kYGh18eI4Brss2U5CDodp6It5xGiXZQrzdYMYyUTcHCFcVsW4uKLpiYjydVDviLiwtUiSoUO1QjJ_e5evd4Kw";
  // Obtain your accountId from demo.docusign.com -- the account id is shown in the drop down on the
  // upper right corner of the screen by your picture or the default picture.
  const accountId = envir.ACCOUNT_ID || qp.ACCOUNT_ID || "11319545";

  // Recipient Information:
  const signerName = envir.USER_FULLNAME || qp.USER_FULLNAME || "Maggie Tang";
  const signerEmail =
    envir.USER_EMAIL || qp.USER_EMAIL || "maggietang47@gmail.com";

  // The document you wish to send. Path is relative to the root directory of this repo.
  const fileName = "demo_documents/Docusign1.pdf";
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /**
   *  The envelope is sent to the provided email address.
   *  One signHere tab is added.
   *  The document path supplied is relative to the working directory
   */
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(basePath);
  apiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);
  // Set the DocuSign SDK components to use the apiClient object
  docusign.Configuration.default.setDefaultApiClient(apiClient);

  // Create the envelope request
  // Start with the request object
  const envDef = new docusign.EnvelopeDefinition();
  //Set the Email Subject line and email message
  envDef.emailSubject = "Please sign this document.";
  envDef.emailBlurb = "Please sign this document.";

  // Read the file from the document and convert it to a Base64String
  const pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName)),
    pdfBase64 = pdfBytes.toString("base64");

  // Create the document request object
  const doc = docusign.Document.constructFromObject({
    documentBase64: pdfBase64,
    fileExtension: "pdf", // You can send other types of documents too.
    name: "Sample document",
    documentId: "1",
  });

  // Create a documents object array for the envelope definition and add the doc object
  envDef.documents = [doc];

  // Create the signer object with the previously provided name / email address
  const signer = docusign.Signer.constructFromObject({
    name: signerName,
    email: signerEmail,
    routingOrder: "1",
    recipientId: "1",
  });

  // Create the signHere tab to be placed on the envelope
  const signHere = docusign.SignHere.constructFromObject({
    documentId: "1",
    pageNumber: "1",
    recipientId: "1",
    tabLabel: "SignHereTab",
    xPosition: "195",
    yPosition: "147",
  });

  // Create the overall tabs object for the signer and add the signHere tabs array
  // Note that tabs are relative to receipients/signers.
  signer.tabs = docusign.Tabs.constructFromObject({signHereTabs: [signHere]});

  // Add the recipients object to the envelope definition.
  // It includes an array of the signer objects.
  envDef.recipients = docusign.Recipients.constructFromObject({
    signers: [signer],
  });
  // Set the Envelope status. For drafts, use 'created' To send the envelope right away, use 'sent'
  envDef.status = "sent";

  // Send the envelope
  // The SDK operations are asynchronous, and take callback functions.
  // However we'd pefer to use promises.
  // So we create a promise version of the SDK's createEnvelope method.
  let envelopesApi = new docusign.EnvelopesApi(),
    // createEnvelopePromise returns a promise with the results:
    createEnvelopePromise = promisify(envelopesApi.createEnvelope).bind(
      envelopesApi,
    ),
    results;

  try {
    results = await createEnvelopePromise(accountId, {
      envelopeDefinition: envDef,
    });
  } catch (e) {
    let body = e.response && e.response.body;
    if (body) {
      // DocuSign API exception
      res.send(`<html lang="en"><body>
                  <h3>API problem</h3><p>Status code ${e.response.status}</p>
                  <p>Error message:</p><p><pre><code>${JSON.stringify(
                    body,
                    null,
                    4,
                  )}</code></pre></p>`);
    } else {
      // Not a DocuSign exception
      throw e;
    }
  }
  // Envelope has been created:
  if (results) {
    res.send(`<html lang="en"><body>
                <h3>Envelope Created!</h3>
                <p>Signer: ${signerName} &lt;${signerEmail}&gt;</p>
                <p>Results</p><p><pre><code>${JSON.stringify(
                  results,
                  null,
                  4,
                )}</code></pre></p>`);
  }
}

router.get("/sign", runAsync(sendEnvelopeController));

module.exports = router;
