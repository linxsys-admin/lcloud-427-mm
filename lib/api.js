// AWS S3 Commucation wrapper

'use strict';

const _ = require('lodash');
const aws = require('aws-sdk');

/**
 * AWS.S3.listObjects wrapper
 *
 * @param {Object} s3 AWS.S3 instance
 * @param {Object} [params]
 * @returns {Promise}
 */
const listObjects = (s3, params) => {
  return new Promise((resolve, reject) => {
    s3.listObjects(params || {}, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

/**
 * Iterates over each bucket object.
 *
 * @param {Object} s3 AWS.S3 instance
 * @param {Function} cb callback
 * @returns {Promise}
 */
const eachObjectContent = (s3, cb) => {
  const collectContents = (resolve, reject, marker) => {
    listObjects(s3, {
      Marker: marker
    }).then(data => {
      _.each(data.Contents, cb);
      if (data.IsTruncated) {
        collectContents(
          resolve,
          reject,
          data.NextMarker || data.Contents[data.Contents.length - 1].Key
        );
      } else {
        resolve();
      }
    }, reject);
  };
  return new Promise(collectContents);
};

/**
 * Iterates over each bucket object filtered by regexp.
 *
 * @param {Object} s3 AWS.S3 instance
 * @param {string} regex
 * @param {Function} cb callback
 * @returns {Promise}
 */
const eachFilteredObjectContent = (s3, regex, cb) => {
  return eachObjectContent(s3, content => {
    if (content.Key.match(regex)) {
      cb(content);
    }
  });
};

/**
 * Upload file content to the bucket.
 *
 * @param {Object} s3 AWS.S3 instance
 * @param {string} key Object key
 * @param {string} content Object content
 * @returns {Promise}
 */
const uploadFile = (s3, key, content) => {
  return new Promise((resolve, reject) => {
    s3.upload({
      Key: key,
      Body: content
    }, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

/**
 * Delete object by given key.
 *
 * @param {Object} s3 AWS.S3 instance
 * @param {string} key Object key
 * @returns {Promise}
 */
const deleteObject = (s3, key) => {
  return new Promise((resolve, reject) => {
    s3.deleteObject({Key: key}, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

module.exports = options => {
  const s3 = new aws.S3(options);
  
  return {
    eachContent: _.curry(eachObjectContent)(s3),
    eachFilteredContent: _.curry(eachFilteredObjectContent)(s3),
    uploadFile: _.curry(uploadFile)(s3),
    deleteObject: _.curry(deleteObject)(s3),
  }
};
