// AWS S3 Commucation wrapper

'use strict';

const _ = require('lodash');
const aws = require('aws-sdk');
const Rx = require('rxjs');

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
 * Create Observable on bucket objects.
 *
 * @param {Object} s3 AWS.S3 instance
 * @returns {Object} Rx.Observable
 */
const bucketObjects = s3 => Rx.Observable.create(function subscribe(observer) {

  const getNextDataMarker = data =>
    data.NextMarker || data.Contents[data.Contents.length - 1].Key;

  const processResponseData = data => {
    _.each(data.Contents, content => observer.next(content));
    // Fetch more data if result is truncated
    if (data.IsTruncated) {
      collectObjects(getNextDataMarker(data));
    } else {
      observer.complete();
    }
  };

  const collectObjects = marker => {
    listObjects(s3, {
      Marker: marker
    }).then(processResponseData, observer.error);
  };

  collectObjects();
});

/**
 * Upload file content to the bucket.
 *
 * @param {Object} s3 AWS.S3 instance
 * @param {string} key Object key
 * @param {string} content Object content
 * @returns {Promise}
 */
const createObject = (s3, key, content) => {
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
    s3.deleteObject({
      Key: key
    }, function(err, data) {
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
    createObject: _.curry(createObject)(s3),
    deleteObject: _.curry(deleteObject)(s3),
    objects: bucketObjects(s3)
  }
};
