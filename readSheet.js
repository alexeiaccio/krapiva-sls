const { google } = require("googleapis");
const privatekey = JSON.parse(process.env.PRIVATE_KEY);

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

function readSheet(range, cb) {
  const sheets = google.sheets("v4");

  return sheets.spreadsheets.values.get(
    {
      auth: jwtClient,
      spreadsheetId: process.env.SHEET_ID,
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
