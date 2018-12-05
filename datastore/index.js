const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
Promise.promisifyAll(fs);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId(function(err, counter) {
    if (err) {
      callback(err);
    } else {
      items[counter] = text;
      
      var fileName = counter + '.txt';
      
      var obj = {id: counter, text: text};
      
      fs.writeFile(path.join(exports.dataDir, fileName), text, (err) => {
        if (err) {
          throw (err);
        } else {
          callback(null, obj);
        }
      });
    }
  });
  
};


/*
O: want to return an array of objects with this structure:

{id: fileName, text: 00001}
  //this means we have to slice off the .txt from the end of fileNames

*/

exports.readAll = (callback) => {
  
  fs.readdirAsync(exports.dataDir)
    .then(function(files) {
      var data = _.map(files, (file) => {
        var target = path.basename(file, '.txt');
        return fs.readFileAsync(exports.dataDir + '/' + file, 'utf8')
          .then(body => {
            return {id: target, text: body}; 
          });
      });
      Promise.all(data).then((items, reject) => {
        console.log(items, 'itemssssssssssssssss');
        return callback(null, items);
      });
    });
  
};


/*
Pseudocode:
  /use the Async version of readdir to read the exports.DataDir
  /write an anonymous function which will:
    /declare data variable and set equal to _.map(files, function(file)...)
      /for each file we want to read the contents inside the file. 
      /that means we need to call fs.readFileAsync on each file of the itteration
        /return {id: id, text: text} after everything has been read. 
  
  /use Proimise.all which takes our data array of promises, and then use .then
    /pass .then a function which has a promise as its input and returns {id: id, text: text}



*/











exports.readOne = (id, callback) => {
  var target = exports.dataDir + '/' + id + '.txt';
 
  // console.log(target, 'target');
  fs.readFile(target, 'utf8', (error, data) => {
    if (error) {
      callback(error); 
    } else {
      callback(null, {id: id, text: data});
    }
  });
};

exports.update = (id, text, callback) => {
  
  var target = exports.dataDir + '/' + id + '.txt';
  
  fs.readFile(target, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(target, text, err => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  
  var target = exports.dataDir + '/' + id + '.txt';
  
  fs.unlink(target, (err, files) => {
    if (err) {
      callback(err);
    } else {
      callback();                    
    }
  });
};






// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
