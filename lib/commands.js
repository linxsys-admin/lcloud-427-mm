'use strict';

const _ = require('lodash');
const fs = require('fs');
const api = require('./api');

const handleError = err => console.log(`Error: ${err}`);

const readFileContent = (filepath) => new Promise((resolve, reject) => {
  fs.readFile(filepath, (err, data) => {
    if (err) reject(err);
    resolve(new Buffer(data, 'binary'));
  });
});

module.exports.list = (s3, regexFilter) => {
  const displayContent = (content) => console.log(content.Key);

  if (regexFilter) {
    return api.eachFilteredContent(s3, regexFilter, displayContent).catch(handleError);
  }

  return api.eachContent(s3, displayContent).catch(handleError);
};

module.exports.upload = (s3, filepath, key) => readFileContent(filepath)
  .then(content => api.uploadFile(s3, key, content));
