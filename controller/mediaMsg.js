const uploadImg=require('../util/awsService')


exports.UploadImg=(req, res)=>{

    const file=req.file;
    console.log(file)
  
    uploadImg('chatmediaapp','image',file.originalname,file.buffer)
    .then(result=>{
    console.log("this is a file url",result)
    res.send(result)
})
.catch(err=>console.log("error on uploadi", err))
}