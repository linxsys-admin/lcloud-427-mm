'use strict';

const _ = require('lodash');
const fs = require('fs');
const api = require('./api');

const handleError = err => console.log(`Error: ${err}`);

const displayContents = contents => _.each(contents, item => console.log(item.Key));

const readFileContent = (filepath) => new Promise((resolve, reject) => {
  fs.readFile(filepath, (err, data) => {
    if (err) reject(err);
    resolve(new Buffer(data, 'binary'));
  });
});

module.exports.list = (s3) => api.listContents(s3).then(displayContents, handleError);

module.exports.upload = (s3, filepath, key) => readFileContent(filepath)
  .then(content => api.uploadFile(s3, key, content));
