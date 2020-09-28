//Configure S3

const aws = require('aws-sdk');

let s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    region: process.env.REGION,
    params: {
        ACL : 'public-read',
        Bucket: process.env.AWS_BUCKET
    }
});

module.exports = s3;