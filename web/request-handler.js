var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var filename = '';

  if(req.method == 'GET'){
    if(req.url == '/'){
      //the ./ makes it an absolute path
      filename = './web/public/index.html';
    }
    else{
      filename = archive.paths.archivedSites +  req.url;
    }

    fs.exists(filename, function(exists){
      console.log(filename);
      if(exists){
        fs.readFile(filename, function(err, data){
          if(err) throw err;
          res.end(data);
        });
      }
      else{
        //return 404 error
        res.writeHead(404);
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
      res.writeHead(302);

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
