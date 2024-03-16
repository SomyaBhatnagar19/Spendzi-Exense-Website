//S3 Services for download and file uploads

require("dotenv").config();
const AWS = require("aws-sdk");
const uploadToS3 = async(data, filename) => {

    const BUCKET_NAME = process.env.BUCKET_NAME;
      const IAM_USER_KEY = process.env.IAM_USER_KEY;
      const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  
    AWS.config.update({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });
    const s3bucket = new AWS.S3({ params: { Bucket: BUCKET_NAME } });
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read", 
    };
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log('Something went wrong.', err);
      } else {
        console.log('File uploaded successfully.', s3response.Location);
      }
    });
  };

  module.exports = {
   uploadToS3,
  };