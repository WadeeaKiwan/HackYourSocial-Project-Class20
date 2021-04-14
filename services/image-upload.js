const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('config');
const SECRET_ACCESS_KEY = config.get('secretAccessKey');
const ACCESS_KEY_ID = config.get('accessKeyID');

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY ||SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID || ACCESS_KEY_ID,
  region: 'eu-central-1',
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'uploads-images',
    acl: 'public-read',
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

module.exports = upload;
