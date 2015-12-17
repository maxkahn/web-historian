var path = require('path');
var mime = require('mime');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var headers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var filename = '';
  headers.headers.ContentType = mime.lookup(req.url);
  console.log(headers.headers.ContentType);

  //***********************************************
  //CLEANS REQUEST URL FOR FILE-NAME ALLOCATION
  req.url = req.url.slice(1);
  console.log(req.url);

  if(req.url === ''){
    //the ./ makes it an absolute path
    filename = './web/public/index.html';
  }
  else{
    var reg = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g;
    //entered valid url
    if(reg.exec(req.url)){
      filename = archive.paths.archivedSites +  req.url;
    }
    else{
      filename = './web/public/' + req.url;
    }    
  }
  //************************************************

  if(req.method == 'GET'){

    fs.exists(filename, function(exists){
      if(exists){
        fs.readFile(filename, function(err, data){
          if(err) throw err;
          res.writeHead(200, headers.headers);
          res.end(data);
        });
      }
      else{
        //return 404 error
         //get end of pathname use mime types
        res.writeHead(404, headers.headers);
        res.end(archive.paths.list);
      }
    });

  }
  else if(req.method == 'POST'){
    //save the site
    var body = '';
    req.on('data', function(data){
      body += data;
    });
    req.on('end', function(){
      //equal signs in text are interpreted as %3D thus this is valid splitting behaviour
      var dat = body.toString().split('=');
      var dataToAppend = dat[1];

      //return 302
      res.writeHead(302, headers.headers);

      if(archive.isUrlInList(dataToAppend, function(exists){
        if(exists){
          fs.readFile(archive.paths.archivedSites + '/' + dataToAppend, function(err, data){
            if(err) throw err;
            res.end(data);
          });
        }
        else{
          //append to textfile
          fs.appendFile(archive.paths.list, dataToAppend + '\n', function(err){
            if(err) throw err;
            
            //create page's file under sites
            archive.downloadUrls([dataToAppend]);
            
            //check whether page has loaded - by calling isUrlArchived and callback inside it
              //if loaded, display site's own page
              //else, display loading page
            //read loading page
            fs.readFile('./web/public/loading.html', function(err, data){
              if(err) throw err;
              res.end(data);
            });
          });

        }
      }));
    });
  }

  

  // res.end(archive.paths.list);
};
