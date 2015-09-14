//app-specific sentence

module.exports = {
  debug : false,
  slackChannel : "#football",
  serverPort : 8080,
  pingInteralInMilliseconds : 1000 * 60, // server main loop interval. 6 hours
  postBeforeTheMatch : true,
  postAfterTheMatch : true,
  preMatchWindowInMinutes: "in 5 minutes", // moment.js humanize expression
  postMatchWindowInHours: "2 hours ago" // moment.js humanize expression
};
