let fs = require('fs');
const config = require('../src/config');

// Repos for JSON server. May at some point want to replace with mongo connection

const FILE_NAME = config.jsonFile;

let scoreRepo = {
  get: function (resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      }
      else {
        resolve(JSON.parse(data));
      }
    });
  },
  getById: function (userId, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      }
      else {
        let user = JSON.parse(data).find(p => p.userId == userId);
        resolve(user);
      }
    });
  },
  search: function (searchObject, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      }
      else {
        let users = JSON.parse(data);
        // Perform search
        if (searchObject) {
          user = users.find(
            p => (searchObject.userId ? p.userId == searchObject.userId : true));
        }
  
        resolve(user);
      }
    });
  },
  insert: function (newData, resolve, reject) {
   fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      }
      else {
        let users = JSON.parse(data);
        users.push(newData);
        fs.writeFile(FILE_NAME, JSON.stringify(users), function (err) {
          if (err) {
            reject(err);
          }
          else {
            resolve(newData);
          }
        });
      }
    });
  },
  update: function (newData, userId, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      }
      else {
        let users = JSON.parse(data);
        let user = users.find(p => p.userId == userId);
        if (user) {
          Object.assign(user, newData);
          fs.writeFile(FILE_NAME, JSON.stringify(users), function (err) {
            if (err) {
              reject(err);
            }
            else {
              resolve(newData);
            }
          });
        }
      }
    });
  },
  delete: function (userId, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      }
      else {
        let users = JSON.parse(data);
        let index = users.findIndex(p => p.userId == userId);
        if (index != -1) {
          users.splice(index, 1);
          fs.writeFile(FILE_NAME, JSON.stringify(users), function (err) {
            if (err) {
              reject(err);
            }
            else {
              resolve(index);
            }
          });
        }
      }
    });
  }  
};

module.exports = scoreRepo;