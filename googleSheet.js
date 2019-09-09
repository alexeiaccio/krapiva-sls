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

function writeToRange(range, values) {
  const sheets = google.sheets("v4");

  sheets.spreadsheets.values.append(
    {
      auth: jwtClient,
      spreadsheetId: process.env.SHEET_ID,
      range: range,
      includeValuesInResponse: true,
      insertDataOption: "INSERT_ROWS",
      valueInputOption: "USER_ENTERED",
      responseDateTimeRenderOption: "FORMATTED_STRING",
      resource: {
        values: values
      }
    },
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result.data);
      }
    }
  );
}

function updateToRange(range, values) {
  const sheets = google.sheets("v4");

  sheets.spreadsheets.values.update(
    {
      auth: jwtClient,
      spreadsheetId: process.env.SHEET_ID,
      range: range,
      includeValuesInResponse: true,
      valueInputOption: "USER_ENTERED",
      responseValueRenderOption: "FORMATTED_VALUE",
      resource: {
        values: values
      }
    },
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result.data);
      }
    }
  );
}

function updateSheet(range, values) {
  const sheets = google.sheets("v4");

  sheets.spreadsheets.values.get(
    {
      auth: jwtClient,
      spreadsheetId: process.env.SHEET_ID,
      range: range,
      majorDimension: "ROWS",
      valueRenderOption: "FORMATTED_VALUE"
    },
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        const matchValues = result.data.values.filter(
          value => value[0] === values[0]
        );
        const newValues = result.data.values.map(
          value =>
            value[0] === values[0]
              ? value.map(
                  (x, i) =>
                    i !== 0 ? (Number(x) + Number(values[i])).toString() : x
                )
              : value
        );
        if (matchValues.length > 0) {
          updateToRange(range, newValues);
        } else {
          writeToRange(range, [values]);
        }
      }
    }
  );
}

module.exports = updateSheet;
