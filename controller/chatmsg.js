const chatmsg = require('../model/chatmsg')
const User = require('../model/user');
const Group = require('../model/group')

const {Op}=require('sequelize')

exports.postmsg = async (req, res) => {
    const message = req.body.message;
    const userId = req.user.id
    console.log(req.body.url)
    if (message == undefined || message.length == 0) {
        return res.status(401).json({ message: "send the valid message", succes: false })
    }
    try {
        const postmsg = await chatmsg.create({ message,userId,groupId:req.body.groupId,url:req.body.url})
        res.status(201).json(postmsg)
    }
    catch (err) {
     res.status(404).json({ message: "something went wrong ", succes: false })
    }

}
/*
exports.getMesg = async (req, res) => {
    const alluserMessage = [];
    console.log(req.query.lastmsgId)
    console.log('this is a get mesg',req.query.groupId)
    try {
        const allMsg = await chatmsg.findAll({where:{
            id:{[Op.gt]: req.query.lastmsgId},
            groupId:req.query.groupId
        }})
        console.log("all message with group assoc",allMsg)
        for (let i = 0; i < allMsg.length; i++) {
            const userId = allMsg[i].userId
            const message = allMsg[i].message;
            console.log(userId, req.user.id)
           const user = await User.findByPk(userId);
           let senderName = user.name;
            if(senderName==req.user.name){
                senderName="You"
            }
            alluserMessage.push({ senderName: senderName, message: message,messageId:allMsg[i].id })
        }
        res.status(200).send(alluserMessage)
    }
    catch (err) {
        res.status(404).json({ "message": "somthing wrong in getmsg" })
    }
}
*/

exports.getGroupMsg = async (req, res) => {
    const alluserMessage = [];
    console.log(req.query.lastmsgId)
    console.log('group id id',req.query.msgId)
   try{

    const alluserMessage = await chatmsg.findAll({
        where: {
          id: { [Op.gt]: req.query.lastmsgId },
          userId: req.user.id,
          groupId:req.query.msgId
        }
      });
    res.send(alluserMessage)

   }
    catch (err) {
        console.log(err)
        res.status(404).json({ "message": "somthing wrong in getmsg" })
    }
}

exports.getMesg=(req, res)=>{
    console.log(req.query.lastmsgId)
    console.log('this is a get group id',req.query.groupId)
    Group.findByPk(req.query.groupId, {
        include: [
          {
            model: chatmsg,
            where:{ id: { [Op.gt]: req.query.lastmsgId },},
            include: [
              {
                model: User,
                attributes: ['name', 'email']
              }
            ]
          }
        ]
      })
        .then(group => {
          if (group) {
           //  console.log(group)
             res.send(group.chatmessages)
          } else {
            console.log('Group not found');
            res.send("group not found")
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
}