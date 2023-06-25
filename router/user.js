const express=require('express')
const userControler=require('../controller/user')
const rout=express.Router();

rout.post('/signUp',userControler.postData)

module.exports=rout;