var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require("http");
var helpers = require('../web/http-helpers');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data){
    var urls = data.split('\n');
    if(urls[urls.length -1].length <= 1){
      urls.pop();
    }
    //console.log(urls);
    return callback(urls);
  });
};

exports.isUrlInList = function(sitename, callback) {
  exports.readListOfUrls(function(urls){
    return urls.indexOf(sitename) >= 0 ? callback(true) : callback(false);
  });
};

exports.addUrlToList = function(sitename, callback) {
  var dataToAppend = sitename + '\n';

  //append to textfile
  fs.appendFile(exports.paths.list, dataToAppend, function(err){
    if(err) throw err;
    return callback();
  });
};

exports.isUrlArchived = function(sitename, callback) {
  fs.exists(exports.paths.archivedSites + '/' + sitename, function(exists){
    return callback(exists);
  });
};

exports.downloadUrls = function(newsites) {
  //ignore the sites.txt as we are instructed to take in an array of sites
  //iterate over sites
  for(var i = 0; i < newsites.length; i++){
    //call html fetch here
   var options = {
      hostname: newsites[i],
      port: 80,
      headers: helpers.headers,
      rejectUnauthorized: false,
      requestCert: true,
      agent: false
    };

    // console.log();

    request('http://' + options.hostname, function (error, response, body) {
      // console.log(body); // Show the HTML for the Google homepage. 
      fs.writeFile(exports.paths.archivedSites + '/' + options.hostname, body, function(err) {
        if (err) {
          throw err;
        }
      });
    });
  }
  //download sites to /sites archive
};

var fetchRemoteHTML = function(url){
  
};
