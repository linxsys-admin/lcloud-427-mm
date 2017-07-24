'use strict';

const _ = require('lodash');
const helpers = require('./helpers')

const bucketName = process.env.BUCKET_NAME || 'lcloud-427-mm';

const api = require('./api')({
  apiVersion: '2006-03-01',
  params: {
    Bucket: bucketName
  }
});

const objectRegexFilter = regex => object => object.Key.match(regex);

const handleError = err => console.log(`Error: ${err}`);

/**
 * Lists all bucket files (object keys).

 * @param {string} [regex] Filter results by regexp.
 */
module.exports.list = regex => {
  const printObject = content => console.log(content.Key);

  if (regex) {
    api.objects.filter(objectRegexFilter(regex)).subscribe(printObject);
  } else {
    api.objects.subscribe(printObject);
  }
};

/**
 * Upload a local file to the S3 bucket.

 * @param {string} filepath Upladed file path.
 * @param {string} key Target object's key.
 * @returns {Promise}
 */
module.exports.upload = (filepath, key) =>
  helpers.readFileContent(filepath)
  .then(content => api.createObject(key, content))
  .catch(handleError);


/**
 * Deletes all files matching a regex from a bucket.

 * @param {string} regex
 * @returns {Promise}
 */
module.exports.delete = regex => {
  const deleteObject = content => api.deleteObject(content.Key);

  api.objects.filter(objectRegexFilter(regex)).subscribe(deleteObject);
};
