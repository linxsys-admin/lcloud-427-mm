require('dotenv').config();
const _ = require('lodash');
const aws = require('aws-sdk');
const fs = require('fs');
const api = require('./lib/api');

const bucketName = 'lcloud-427-mm';

const s3 = new aws.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: bucketName}
});

const displayContents = contents => _.each(contents, item => console.log(item.key));

const handleError = err => console.log(`Error: ${err}`);

const readFileContent = (filepath) => new Promise((resolve, reject) => {
  fs.readFile(filepath, (err, data) => {
    if (err) reject(err);
    resolve(new Buffer(data, 'binary'));
  });
});

const uploadFile = (filepath, key) => readFileContent(filepath)
  .then(content => api.uploadFile(s3, key, content));


//api.listContents(s3).then(displayContents, handleError);
//uploadFile('file.txt', 'test.txt').catch(handleError);
