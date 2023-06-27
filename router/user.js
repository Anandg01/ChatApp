const express=require('express')
const userControler=require('../controller/user')
const rout=express.Router();

rout.post('/signUp',userControler.postData)
rout.post('/login',userControler.login)
module.exports=rout;