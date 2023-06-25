const express=require('express')
const userRout=require('./router/user')
const sequelize=require('./util/database')
const app=express()
const bodyparser=require('body-parser')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));


app.use('/user',userRout)

sequelize
//.sync({force:true})
.sync()
.then((res)=>{
    app.listen(2000, console.log("server Running...."))
})
.catch((err)=>console.log('erro ',err))
