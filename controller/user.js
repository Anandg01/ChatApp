const user=require('../model/user')
const bcrypt = require('bcrypt');

exports.postData=async (req, res)=>{
    const {name, email,phone,password}=req.body;
    console.log(name, req.body)
    
    try{
        const hash= await bcrypt.hash(password,10)
    await user.create({name, email,phone,password:hash})
       res.status(201).json({ message: 'Successfully created new user' });
        }
       catch(err){
           res.status(303).json({ message: 'An error occurred while creating the user',error:err.fields})
}
}