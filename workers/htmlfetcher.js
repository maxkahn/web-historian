var http = require("http");
var helpers = require('../web/http-helpers');
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.


//connect to remote server
//get information (decide how much detail we want)
//create files
//save inside the files we created

//note: this could take a while and fail tests. 

/*
The tests expect your server to handle and return incoming JSON data, 
but the browsers native form handling will use form-encoding instead of JSON. 
You can either use jQuery to send JSON from the client, or modify the tests to send 
form-encoded data
*/
//NOT FINAL FORM OF METHOD
//DO NOT FORGET TO REFACTOR
var fetchRemoteHTML = function(url){
  var options = {
    hostname: 'www.google.com',
    port: 80,
    headers: helpers.headers
  };

  //VOMITS INTO CONSOLE
  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
    res.on('end', function() {
      console.log('No more data in response.');
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();
};

