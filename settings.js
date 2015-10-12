//app-specific sentence

module.exports = {
  debug : false,
  slackChannel : "#football",
  serverPort : 8080,
  pingInteralInMilliseconds : 1000 * 60, // server main loop interval.
  postBeforeTheMatch : true,
  postAfterTheMatch : true,
  preMatchWindowInMinutes: 5, // time before the match in minutes when we are ready to rant
  preMatchWindowCloseTimeInMinutesBeforeMatch: 1, //time before the match in minutes when ranting closes
  postMatchWindowInHours: 2,  // time after then match in hours when we are ready to rant
  postMatchWindowCloseTimeInHoursAfterMatch: 24, // time after the match in hours when rant window closes
  GA : 'UA-68256772-1', // Google analytics tracking ID
  gaIgnoreHosts: ['localhost:8080', 'localhost:5000', 'moubot.com'] //list of hosts to be ignored on API paths
};
