const express=require('express')
const dotenv = require('dotenv');
dotenv.config();
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

const userRout=require('./router/user')
const msgRout=require('./router/chatmsg')
const groupRout=require('./router/group')

app.use('/user',userRout)
app.use('/group',groupRout)
app.use(msgRout)


app.use((req, res)=>{
    console.log('usr', req.url)
    if (req.url.endsWith('.html')) {
        res.sendFile(path.join(__dirname,'views',req.url))
    }
    else{
        res.sendFile(path.join(__dirname,req.url))
    }
})

const User=require('./model/user');
const Chtmsg=require('./model/chatmsg');
const Group=require('./model/group');
const userGroup=require('./model/userGroup')


User.hasMany(Chtmsg);
Chtmsg.belongsTo(User);

Group.hasMany(Chtmsg)
Chtmsg.belongsTo(Group)

User.belongsToMany(Group, { through: userGroup });
Group.belongsToMany(User, { through: userGroup });

sequelize
//.sync({force:true})
.sync()
.then((res)=>{
    app.listen(2000, console.log("server Running...."))
})
.catch((err)=>console.log('erro ',err))
