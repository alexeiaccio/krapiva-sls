const Prismic = require('prismic-javascript')
const apis = JSON.parse(process.env.PRISMIC_APIS);

function fetchSearch(req, res) {
  let results = [];
  Object.keys(apis).forEach((key, index, array) => {
    Prismic.getApi(`http://${key}.prismic.io/api/v2`, { accessToken: apis[key] })
      .then(function(api) {
        return api.query([
          Prismic.Predicates.any('document.type', [
            'articles',
            'events',
            'places',
            'authors',
          ]),
          Prismic.Predicates.fulltext('document', req),
        ], { pageSize : 5 })
      })
      .then(
        function(response) {
          if (index < array.length - 1) {
            results = results.concat(response.results)
          } else {
            res(results)
          }
        },
        function(err) {
          console.log('Something went wrong: ', err)
        }
      )
  })
}

module.exports = fetchSearch
