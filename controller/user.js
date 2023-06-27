const User=require('../model/user')
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')

function validString(str) {
    if (str == undefined || str.length === 0) {
      console.log(str)
        return true;
    }
        return false;
  }
exports.postData=async (req, res)=>{
    const {name, email,phone,password}=req.body;
    if (phone==undefined|| validString(name) || validString(password)||validString(email)) {
        return res.status(401).json({ message: 'Fill all Data', success: false })
      }

    try{
        const hash= await bcrypt.hash(password,10)
        await User.create({name, email,phone,password:hash})
       res.status(201).json({ message: 'Successfully created new user' });
        }
       catch(err){
           res.status(303).json({ message: 'An error occurred while creating the user',error:err.fields})
}
}


function generateAccessToken(userId) {
  return jwt.sign(userId, process.env.TOKEN_SECRET);
}

exports.login=async(req, res)=>{
    const {email, password}=req.body;
    if(validString(email)||validString(password)){
       return res.status(202).json({"message":"Provide valid details"})
    }
    try{
       const user=await User.findAll({where:{email}})
       const hash=user[0].password;
     const token=generateAccessToken(user[0].id)
      console.log(user[0].name,token)
      const isMatch = await bcrypt.compare(password, hash);
      if(!isMatch){
       return res.status(401).json({message:"User not authorized"})
      }
     res.status(200).json({message:"User Login",succes:true,token:token})
    }
    catch(err){
      res.status(404).json({"message":"User is not found SignUp first"})
      console.log("error oucred")
    }
}