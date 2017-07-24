#!/usr/bin/env node
'use strict';

require('dotenv').config();
const _ = require('lodash');
const program = require('commander');
const aws = require('aws-sdk');
const commands = require('./lib/commands');

const bucketName = 'lcloud-427-mm';

const s3 = new aws.S3({
  apiVersion: '2006-03-01',
  params: {
    Bucket: bucketName
  }
});

program
  .version('0.0.1');

program
  .command('list')
  .description('list all files in an S3 Bucket')
  .option("-f, --filter [filter]", "regex filter")
  .action(filter => {
    commands.list(s3, filter);
  });

program
  .command('upload [file] [target]')
  .description('upload a local file to the S3 bucket')
  .action((file, target) => {
    if (file && target) {
      commands.upload(s3, file, target);
    } else {
      console.error('file/target not defined');
    }
  });

  program
    .command('delete [regex]')
    .description('delete all files matching a regex from a bucket')
    .action((regex) => {
      if (regex) {
        commands.delete(s3, regex);
      } else {
        console.error('regex not defined');
      }
    });


program.parse(process.argv);
