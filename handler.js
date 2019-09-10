'use strict'

const updateSheet = require('./googleSheet')
const readSheet = require('./readSheet')
const fetchSearch = require('./prismic')

module.exports.counter = (event, context, callback) => {
  const newValues = [
    event.queryStringParameters.path,
    event.queryStringParameters.view,
    event.queryStringParameters.burned,
  ]

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
    body: JSON.stringify({
      message: 'Updated!',
      input: event,
    }),
  }

  updateSheet('Counter!A2:C', newValues)
  callback(null, response)
}

module.exports.get = (event, context, callback) => {
  const response = values => ({
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
    body: JSON.stringify({
      message: 'Got!!',
      values: values,
      input: event,
    }),
  })

  readSheet('Counter!A2:C', values => callback(null, response(values)))
}

module.exports.search = (event, context, callback) => {
  const query = event.queryStringParameters.searchquery
  const response = values => ({
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
    body: JSON.stringify({
      message: 'Got!!',
      values: values,
      input: event,
    }),
  })

  fetchSearch(query, values => callback(null, response(values)))
}
