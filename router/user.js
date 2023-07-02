const express=require('express')
const userControler=require('../controller/user')
const rout=express.Router();

rout.post('/signUp',userControler.postData)
rout.post('/login',userControler.login)
rout.get('/getUser',userControler.getUser)
rout.get('/search',userControler.getUserbyphoneorEmail)
module.exports=rout;