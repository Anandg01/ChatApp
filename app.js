const express=require('express')
const userRout=require('./router/user')
const sequelize=require('./util/database')
const cors=require('cors')

const path=require('path')



const app=express()
app.use(cors(
    {
        origin:"http://localhost:2000"
    }
))
const bodyparser=require('body-parser')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));


app.use('/user',userRout)

app.use((req, res)=>{
    console.log('usr', req.url)
res.sendFile(path.join(__dirname,req.url))
})
sequelize
//.sync({force:true})
.sync()
.then((res)=>{
    app.listen(2000, console.log("server Running...."))
})
.catch((err)=>console.log('erro ',err))
