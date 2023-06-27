const chatmsg = require('../model/chatmsg')
const User = require('../model/user');
const { use } = require('../router/chatmsg');
exports.postmsg = async (req, res) => {
    const message = req.body.message;
    const userId = req.user.id
    if (message == undefined || message.length == 0) {
        return res.status(401).json({ message: "send the valid message", succes: false })
    }
    try {
        const postmsg = await chatmsg.create({ message, userId })
        res.status(201).json({ message: postmsg.message })
    }
    catch (err) {
        return req.status(404).json({ message: "something went wrong ", succes: false })
    }

}

exports.getMesg = async (req, res) => {
    const alluserMessage = [];
    try {
        const allMsg = await chatmsg.findAll()
        for (let i = 0; i < allMsg.length; i++) {
            const userId = allMsg[i].userId
            const message = allMsg[i].message;
            const user = await User.findByPk(userId);
            let senderName = user.name;
            if(senderName==req.user.name){
                senderName="You"
            }
            alluserMessage.push({ senderName: senderName, message: message })
        }
        res.status(200).send(alluserMessage)
    }
    catch (err) {
        res.status(404).json({ "message": "somthing wrong in getmsg" })
    }
}