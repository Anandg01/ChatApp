const jwt=require('jsonwebtoken');
const User=require('../model/user')

  exports.authenticate= (req, res, next)=>{
   try{
   const token=req.header('Authorizan');
   const decodeToken=(jwt.verify(token,process.env.TOKEN_SECRET))
   console.log(decodeToken)
   User.findByPk(decodeToken).then(user=>{
    req.user=user;
   next()
   }).catch(err=>{throw new Error(err)})
} 
   catch(err){
    console.log(err)
    return res.status(401).json({success:false})
   }
}
