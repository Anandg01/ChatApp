const express=require('express')
const groupControler=require('../controller/group')
const auth=require('../midelware/authoruzan')

const rout=express.Router();

rout.post('/create',auth.authenticate, groupControler.createGroup)
rout.get('/getGroup',auth.authenticate,groupControler.getgroup)
rout.get('/byId',groupControler.getGroupByid)
rout.get('/allUsers',auth.authenticate,groupControler.getUserBygroup)
rout.get("/adduser",auth.authenticate,groupControler.adduserInGroup)
rout.post('/removeUser',auth.authenticate,groupControler.removeUserFromGroup)
module.exports=rout;