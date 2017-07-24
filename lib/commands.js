'use strict';

const _ = require('lodash');
const helpers = require('./helpers')

const bucketName = 'lcloud-427-mm';
const api = require('./api')({
  apiVersion: '2006-03-01',
  params: {
    Bucket: bucketName
  }
});

const handleError = err => console.log(`Error: ${err}`);

/**
 * Lists all bucket files (object keys).

 * @param {string} [regexFilter] Filter results by regexp.
 * @returns {Promise}
 */
module.exports.list = regexFilter => {
  const displayContent = (content) => console.log(content.Key);

  if (regexFilter) {
    return api.eachFilteredContent(regexFilter, displayContent).catch(handleError);
  }

  return api.eachContent(displayContent).catch(handleError);
};

/**
 * Upload a local file to the S3 bucket.

 * @param {string} filepath Upladed file path.
 * @param {string} key Target object's key.
 * @returns {Promise}
 */
module.exports.upload = (filepath, key) => helpers.readFileContent(filepath)
  .then(content => api.uploadFile(key, content)).catch(handleError);


/**
 * Deletes all files matching a regex from a bucket.

 * @param {string} regexFilter
 * @returns {Promise}
 */
module.exports.delete = regexFilter => {
  const deleteContent = content => {
    api.deleteObject(content.Key);
  };
  return api.eachFilteredContent(regexFilter, deleteContent).catch(handleError);
};
