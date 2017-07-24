'use strict';
const _ = require('lodash');

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


module.exports.eachContent = (s3, cb) => {
  return eachObjectContent(s3, cb);
};

module.exports.eachFilteredContent = (s3, regex, cb) => {
  return eachObjectContent(s3, content => {
    if (content.Key.match(regex)) {
      cb(content);
    }
  });
};


module.exports.uploadFile = (s3, key, content) => {
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
