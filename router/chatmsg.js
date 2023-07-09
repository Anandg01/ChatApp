const express=require('express');
const multer = require('multer');


const authorization=require('../midelware/authoruzan')
const msgController=require('../controller/chatmsg');
const mediaControler=require('../controller/mediaMsg')
const router=express.Router();


router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(multer().single('image'));

router.post('/msgpost', authorization.authenticate,msgController.postmsg)
router.get('/getmsg',authorization.authenticate ,msgController.getMesg)
router.get('/getgrpmsg',authorization.authenticate, msgController.getGroupMsg)
router.post('/uploadImage',mediaControler.UploadImg)

module.exports=router;