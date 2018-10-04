"use strict";

const writeSheet = require("./googleSheet");
const updateSheet = require("./googleSheet");
const readSheet = require("./readSheet");
const s4 = require("./s4");

module.exports.subscribe = (event, context, callback) => {
  const newValues = [
    s4(),
    new Date().toISOString(),
    event.queryStringParameters.name,
    event.queryStringParameters.email
  ];

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET"
    },
    body: JSON.stringify({
      message: "Write!",
      input: event
    })
  };

  writeSheet("Subscribtions!A:D", newValues);
  callback(null, response);
};

module.exports.counter = (event, context, callback) => {
  const newValues = [
    event.queryStringParameters.path,
    event.queryStringParameters.view,
    event.queryStringParameters.burned
  ];

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET"
    },
    body: JSON.stringify({
      message: "Updated!",
      input: event
    })
  };

  updateSheet("Counter!A2:C", newValues);
  callback(null, response);
};

module.exports.get = (event, context, callback) => {
  const response = values => ({
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET"
    },
    body: JSON.stringify({
      message: "Got!!",
      values: values,
      input: event
    })
  });

  readSheet("Counter!A2:C", values => callback(null, response(values)));
};
