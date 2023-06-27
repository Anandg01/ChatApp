const chatmsg=require('../model/chatmsg')

exports.postmsg=async (req, res)=>{
    const message=req.body.message;
    const userId=req.user.id
    if(message==undefined||message.length==0){
        return res.status(401).json({message:"send the valid message", succes:false})
    }
    try{
    const postmsg=await chatmsg.create({message, userId})
     res.status(201).json({message:postmsg.message})
    }
    catch(err){
        return req.status(404).json({message:"something went wrong ", succes:false})

    }

}