const AWS = require('aws-sdk');
const config = require('../config');

class ImageRepository {
    constructor(){
        this.s3 = new AWS.S3({
            accessKeyId: config.aws.accessKeyId,
            secretAccessKey: config.aws.privateAccessKey,
        })
    }

    uploadImage(name,image, type){
        const Key = `${name}.${type.split('/')[1]}`;
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: config.aws.s3BucketName,
                Key,
                Body: image,
                ContentType: type,
                ACL: 'public-read'
            };

            this.s3.upload(params, (err,data) => {
                if(err){
                    resolve(err)
                }else{
                    resolve(data.Location)
                }
            })
        });
    }
}

module.exports = ImageRepository;