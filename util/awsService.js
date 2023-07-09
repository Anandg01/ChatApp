const AWS=require('aws-sdk');
const { resolveObjectURL } = require('buffer');
const fs=require('fs')
require('dotenv').config();
const s3 = new AWS.S3({
    accessKeyId:process.env.AWS_IAM_USER_KEY,
    secretAccessKey:process.env.AWS_IAM_USER_SECRET,
});


const uploadImage = (bucketName, folderName, name, imgData) => {

  // console.log(bucketName,folderName, imageName, imgData)
   const currentDate = new Date().toISOString().replace(/:/g, '-'); // Get the current date as a string
  const fileName = `${currentDate}${name}`; // Concatenate the current date and the original name

    //const fileContent = fs.readFileSync(imagePath);
    const fileContent=imgData;
  //console.log("file contect for boduy",fileContent)
    const params = {
      Bucket: bucketName,
      Key: `${folderName}/${fileName}`,
      Body: fileContent,
      ACL: 'public-read',
    };
  return new Promise((resp, rej)=>{
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error:', err);
       return rej(err)
      } else {
        const imageUrl = data.Location;
        console.log('Image uploaded successfully.');
        console.log('Image URL:', imageUrl);
      return  resp(imageUrl)
      }
    });
  })
    
  };

module.exports=uploadImage;