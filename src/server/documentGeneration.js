const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const superagent = require("superagent");

// add more arguments to this function as needed
async function generateLicense(
  companyName,
  companyAdress,
  representativeName
) {
  const templateBytes = fs.readFileSync("documents/license.pdf");
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.load(templateBytes);

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const lastPage = pages[3];

  const datetime = new Date();

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();

  // Text for Agreement
  firstPage.drawText(companyName, {
    x: 100,
    y: 570,
    size: 12,
    font: helveticaFont,
    color: rgb(0.1, 0.1, 0.1),
    rotate: degrees(0)
  });
  lastPage.drawText(datetime.toISOString().slice(0, 10), {
    x: 130,
    y: height / 2 + 92,
    size: 20,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1)
  });
  // lastPage.drawText(companyName, {
  //   x: 320,
  //   y: height / 2 + 92,
  //   size: 20,
  //   font: helveticaFont,
  //   color: rgb(0.95, 0.1, 0.1)
  // });
  lastPage.drawText("JOE DOE", {
    x: 250,
    y: height / 2 + 37,
    size: 20,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1)
  });
  return await pdfDoc.save();
}
// add more arguments to this function as needed
async function generateCertificate(
  companyName,
  companyAdress,
  representativeName
) {
  // Load PDF as Binary Data and then Parses it
  const existingPdfBytes = fs.readFileSync("documents/certificate.pdf");
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Embed the Times Roman font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Add a blank page to the document
  const page = pdfDoc.addPage();

  // Get the width and height of the page
  const { width, height } = page.getSize();

  // Draw a string of text toward the top of the page
  const fontSize = 30;
  page.drawText("Creating PDFs in JavaScript is awesome!", {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71)
  });
  return await pdfDoc.save();
}

module.exports = { generateLicense, generateCertificate };
