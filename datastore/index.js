const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId(function(err, counter) {
    if(err) {
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
  var data = [];
  
  fs.readdir(exports.dataDir, (err, files) => {


    _.each(files, (fileName, index) => {
      fileName = fileName.slice(0, -4)
      data.push({ id: fileName, text: fileName });
    });
  
  callback(null, data);
  
  });

};

exports.readOne = (id, callback) => {
 var target = exports.dataDir + '/' + id + '.txt';
 
 console.log(target, 'target')
  fs.readFile(target, 'utf8', (error, data) => {
      // console.log(data, 'DATA')
      // console.log(JSON.parse(data), 'JSONNNN')
      console.log(data)
    if (error) {
      callback(error) 
    } else {
      callback(null, {id: id, text: data});
    }
  });
 
};

exports.update = (id, text, callback) => {
  
  var target = exports.dataDir + '/' + id + '.txt';
  
  fs.readFile(target, 'utf8', (err, data) => {
    if (err) {
      callback(err)
    } else {
        fs.writeFile(target, text, err => {
          if (err) {
            callback(err)
          } else {
            callback(null, {id: id, text: text})
        }
      });
    }
  });
}

exports.delete = (id, callback) => {
  
  var target = exports.dataDir + '/' + id + '.txt';
  
  fs.unlink(target, (err, files) => {
    if (err) {
      callback(err);
    } else {
      callback()
    }
  })
}



//navigate to the directory
//we don't need to itterate
//we can itterate over the array of text files 
  //declare a target variable = id + '.txt'
  //if array[i] === target, then delete array[i]






// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
