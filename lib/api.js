module.exports.listContents = (s3) => {
  return new Promise((resolve, reject) => {
    s3.listObjects({}, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.Contents);
    });
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
