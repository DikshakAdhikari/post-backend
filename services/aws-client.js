const { S3Client, GetObjectCommand, PutObjectCommand }= require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const dotenv = require('dotenv')
dotenv.config()

const s3Client= new S3Client({
    region:"ap-south-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});


   async function getObjectUrl(key){ 
    const command= new GetObjectCommand({
        Bucket: 'blog.dikshak',
        Key: key,
    });

    const url= await getSignedUrl(s3Client, command); 
    return url;
}


  async function putObject(filename, contentType){
    const command= new PutObjectCommand({
        Bucket: 'blog.dikshak',
        Key: `uploads/profile-pic/${filename}`,
        ContentType: contentType
    })
    const url= await getSignedUrl(s3Client, command);
    return url;
}

async function init(){
    console.log('Url for uploading', await putObject(`image-${global.filename}`, global.contentType));

}

// init();

module.exports={
    getObjectUrl, putObject
}
