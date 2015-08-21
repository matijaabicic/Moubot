// add http module and client
var http = require('http');
var request = require('request');

//let the port be configurable
const PORT = 8080;

//receiving and responding to requests
function handleRequest(request, response){
  //no interaction with the server just yet.
  response.end('No interaction allowed.');
}

var server = http.createServer(handleRequest);



//spin up the listener
server.listen(PORT, function(){
  //callback when server is successfully listening
  console.log("Server started at localhost:%s", PORT);

  //set up a timer.
  setInterval(function(){

    //console.log('test');
    request('http://www.google.com', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body); // Print the google web page.
     }
   });
  }, 1000);
} );
