const jwt=require('jsonwebtoken');
const User=require('../model/user')

  exports.authenticate= (req, res, next)=>{
   try{
   const token=req.header('Authorizan');
   if(!token){
     return res.status(200).send(`<h1>first login <a href='/login.html'>Here</a> then open this link</h1>`)
   }
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
