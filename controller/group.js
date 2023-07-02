const group = require('../model/group')
const User = require('../model/user')
const usergroup=require('../model/userGroup');

function validString(str) {
    if (str.length == 0 || str == undefined) {
        return true
    }
    return false;
}

exports.createGroup = async (req, res) => {
    const { groupName, description, userIds,adminIds } = req.body;
    if (validString(groupName) || validString(description)) {
        return res.status(203).json({ "message": "Unvalid string" })
    }
    console.log("Userid ", userIds)
    const UserIds=userIds.map(item => parseInt(item));
    console.log(UserIds)
    const id = String(req.user.id)
    console.log("this is id",id)
    let index = UserIds.indexOf(req.user.id)
    if (index == -1) {
        UserIds.push(req.user.id);
    }
    console.log(UserIds)
    console.log('index,', index, 'userIds ', userIds, 'creater id',id,'admin ids' ,adminIds)
    const adminUserIds = [req.user.id,...adminIds];
    console.log(adminUserIds,'adminnids', adminIds)

    try {
        const Group = await group.create({ groupName, description });      
        // Create entries in UserGroup table for all users, setting admin flag based on the user ID
        const userAssociations = UserIds.map(userId => ({
          userId,
          groupId: Group.id,
          admin: adminUserIds.includes(userId)
        }));
       console.log('user accoacc',userAssociations)
        await usergroup.bulkCreate(userAssociations);
      
        res.status(200).json({"message":'Group created successfully',Group:Group});
      } catch (error) {
        res.status(500).send('An error occurred while creating the group');
      }
}

exports.getGroupByid = (req, res) => {
    group.findByPk(req.query.id)
        .then(Group => {
            console.log(Group.id)
            // res.send(`<h1>jay ho</h1>`)
            res.send(`<h1>Click <a href='/group/addUser?groupId=${Group.id},{ headers: { 'Authorizan': token } '}>join</a></h1>`)
        })
        .catch(err => res.send(err))
}

exports.getgroup = async (req, res) => {
    try {
        const user = req.user;
        const groups = await user.getGroups();
        res.send(groups)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
}

exports.getUserBygroup = async (req, res) => {
    console.log(req.query.groupId)
    const groupId = parseInt(req.query.groupId)
    try {
        const Group = await group.findByPk(groupId);
        if (!group) {
            console.log('groupNot foundd')
            throw new Error('Group not found');
        }
        const users = await Group.getUsers({
            attributes: ['id', 'name', 'email']
        });

        res.status(200).json(users)
    }
    catch (err) {
        //   console.log(err)
        res.status(403).json({ "message": "group not found" })

    }

}

exports.adduserInGroup = async (req, res) => {
    const userId = req.query.userId;
    const groupId = req.query.groupId;
    console.log(userId, groupId,req.query.admin,req.user.id)
   
    try {
     
        const isAdmin = await usergroup.findOne({
            where: {
              userId: req.user.id,
              groupId: groupId,
              admin: true
            }
          });
          if (!isAdmin) {
            return res.status(202).json({ message: "You are not authorized to add users from this group." });
          }
       const Group = await group.findByPk(groupId)
        if (!Group) {
            throw new Error("Group not found")
        }
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("User not found")
        }
        const isAssociated = await Group.hasUser(user);
        if (isAssociated) {
            return res.status(201).json({ "message": "User is already in this group" })
        }
        const UserGroup = await usergroup.create({
            groupId: groupId,
            userId: userId,
            admin: req.query.admin
          });
        res.status(200).send(UserGroup)
    }
    catch (err) {
        res.send(err)
        console.log(err)
    }
}

exports.removeUserFromGroup = async (req, res) => {
    try {
      const userId = req.body.userId;
      const groupId = parseInt(req.body.groupId);
      console.log(groupId, userId)
    if(userId==req.user.id){
        return res.status(203).json({ message: "You are not authorized to remove himself from this group." });
    }
      // Check if the user performing the operation is an admin of the group
      const isAdmin = await usergroup.findOne({
        where: {
          userId: req.user.id,
          groupId: groupId,
          admin: true
        }
      });
  
      if (!isAdmin) {
        return res.status(201).json({ message: "You are not authorized to remove users from this group." });
      }
  
      await usergroup.destroy({
        where: {
          userId: userId,
          groupId: groupId
        }
      });
  
      res.status(200).json({ message: "User removed from the group." });
    } catch (error) {
      console.error("Error removing user from group:", error);
      res.status(500).json({ message: "An error occurred while removing the user from the group." });
    }
  };
  