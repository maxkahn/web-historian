var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data){
    var urls = data.split('\n');
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
    //we only create the files, not populate them as spec is vague
    fs.writeFile(exports.paths.archivedSites + '/' + newsites[i], 'data will be coming', function(err){
      if(err) throw err;
    });
  }
  //download sites to /sites archive
};
