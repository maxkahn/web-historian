var http = require("http");
var helpers = require('../web/http-helpers');
var archive = require('../helpers/archive-helpers');
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
archive.readListOfUrls(archive.downloadUrls);