const express=require('express');
const authorization=require('../midelware/authoruzan')
const msgController=require('../controller/chatmsg');

const router=express.Router();

router.post('/msgpost', authorization.authenticate,msgController.postmsg)
router.get('/getmsg',authorization.authenticate ,msgController.getMesg)
router.get('/getgrpmsg',authorization.authenticate, msgController.getGroupMsg)

module.exports=router;