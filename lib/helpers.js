'use strict';

const fs = require('fs');

/**
 * @param {string} filepath
 * @returns {Promise}
 */
module.exports.readFileContent = (filepath) => new Promise((resolve, reject) => {
  fs.readFile(filepath, (err, data) => {
    if (err) reject(err);
    resolve(new Buffer(data, 'binary'));
  });
});
