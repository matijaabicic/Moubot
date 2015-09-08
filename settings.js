//app-specific sentence

module.exports = {
  serverPort : 8080,
  pingInteralInMilliseconds : 1000*5, // server main loop interval. 6 hours
  postBeforeTheMatch : true,
  postAfterTheMatch : true,
  preMatchWindowInMinutes: "in 5 minutes" // moment.js humanize expression
};
