const { google } = require("googleapis");
const privatekey = require("./krapiva-0734748d4bd3.json");

const SHEET_ID = "1dLj99jB8EsdemDuK2LQ0hV580fOfyqIfdsjb3q0S-yo";

let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

jwtClient.authorize(function(err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Successfully connected!");
  }
});

async function readSheet(range, cb) {
  const sheets = google.sheets("v4");

  return sheets.spreadsheets.values.get(
    {
      auth: jwtClient,
      spreadsheetId: SHEET_ID,
      range: range,
      majorDimension: "ROWS",
      valueRenderOption: "FORMATTED_VALUE"
    },
    function(err, response) {
      if (err) {
        console.log("The API returned an error: " + err);
      } else {
        cb(response.data.values);
      }
    }
  );
}

module.exports = readSheet;
