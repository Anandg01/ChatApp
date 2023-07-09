const socket = io('http://localhost:3000');

const msgInput = document.getElementById('msginput');
const token = localStorage.getItem('token')
const storagemsg = localStorage.getItem('storeMsg');
const hidInput = document.getElementById('hid')
const arrst = JSON.parse(storagemsg)
let lastmsgId = -1
let bkcontainer = [];

socket.on("received", async (groupId) => {
  
    if (groupId == hidInput.value) {
        const GroupMsg = await axios.get(`/getmsg?lastmsgId=${lastmsgId}&groupId=${hidInput.value}`, { headers: { 'Authorizan': token } })
        if (lastmsgId == -1) {
            console.log("last idn -1", lastmsgId)
            createUlList()
        }
        console.log(GroupMsg.data)
        GroupMsg.data.forEach((message) => {
            lastmsgId = message.id
            console.log("las gg", lastmsgId)
            showMsgOnScreen(message.user.name, message.message, message.url)
        })
    }
    else {
        console.log("group not matched")
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    if (!token) {
        window.location.href = '/login.html'
    }
    else {
        try {
            // const user = await axios.get('/user/getUser')
            // showUser(user.data)

            const getGroup = await axios.get('/group/getGroup', { headers: { 'Authorizan': token } })
            console.log(getGroup.data)
            getGroup.data.forEach((el) => {
                showGrpOnscr(el)
            })
        }
        catch (err) {
            console.log(err)
        }
    }
})
//send message to database
msgInput.addEventListener('submit', async (event) => {
    event.preventDefault()
    const message = event.target.sendmsg.value;
    const groupId = event.target.hid.value;
    try {
        const post = await axios.post(`/msgpost`, { message: message, groupId: groupId }, { headers: { 'Authorizan': token } })
        const getmessage = post.data.message;

        socket.emit("send-groupId", groupId)
        //    showMsgOnScreen("You", getmessage)
        document.getElementById('sendmsg').value = '';
    }
    catch (err) {

    }
})

function showMsgOnScreen(senderName, message, url) {
    const listUl = document.getElementById('ulitem')
    const listItem = document.createElement("li");
    const textContainer = document.createElement('div');
    textContainer.textContent = `${senderName}: ${message}`;
    listItem.appendChild(textContainer)

    if (message == "img") {
        const img = document.createElement('img')
        img.src = url
        img.classList.add('media-show')
        listItem.appendChild(img)
    }
    else if (message == "video") {
        const vdo = document.createElement("video")
        vdo.src = url
        vdo.classList.add("media-show")
        vdo.controls = true;
        listItem.appendChild(vdo)
    }
    listUl.appendChild(listItem)
}

//for log out

document.getElementById('lgout').addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.href = '/login.html';
})

//for real time chat  

function realTimemsg() {
    setInterval(async () => {
        try {
            const allmsg = await axios.get(`/getmsg?lastmsgId=${lastmsgId}}&groupId=${hidInput.value}`, { headers: { 'Authorizan': token } })
            // createUlList();
            if (lastmsgId == -1) {
                createUlList();
            }
            allmsg.data.forEach((el) => {
                lastmsgId = el.messageId;
                console.log(lastmsgId)
                showMsgOnScreen(el.senderName, el.message)
            })
            // storeInLocal(allmsg.data)
        }
        catch (err) {
            console.log(err)
        }
    }, 1000)
}

//Store message in local storage
function storeInLocal(Obj) {
    Obj.forEach((el) => {
        bkcontainer.push(el);
        if (bkcontainer.length > 10) {
            bkcontainer.shift();
        }
        //  lastmsgId = el.messageId
        showMsgOnScreen(el.senderName, el.message)
        localStorage.setItem('storeMsg', JSON.stringify(bkcontainer))

    })
}


function createUlList() {
    const divlist = document.getElementById("msgCont");
    const ullis = ` <ul class="licon" id="ulitem"></ul>`
    divlist.innerHTML = ullis;
}

// create group pop up box 
document.getElementById("crtgp").addEventListener("click", function () {
    document.getElementById("overlay").style.display = "block";
    axios.get('/user/getUser').then(res => {
        showUser(res.data, 'boxU')
    })
        .catch(err => console.log('error in get user', err))
    document.body.style.overflow = "hidden";
});

document.getElementById("cl").addEventListener("click", function (e) {
    document.getElementById("overlay").style.display = "none";
    document.body.style.overflow = "auto";
});
// create grop 
function createGroup(e) {
    e.preventDefault();
    const groupDetails = {
        groupName: e.target.GroupName.value,
        description: e.target.Description.value
    }
    const userIds = [];
    const checkboxes = document.querySelectorAll('#boxU input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        userIds.push(checkbox.nextElementSibling.id);
    });
    console.log(userIds)
    axios.post(`/group/create`, { ...groupDetails, userIds, adminIds }, { headers: { 'Authorizan': token } })
        .then(res => {
            console.log(res.data)
            confirm(res.data.message)
            if (res.status == 200) {
                document.getElementById('GroupName').value = '';
                document.getElementById('Description').value = '';
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false
                });
                document.getElementById("overlay").style.display = "none";
                showGrpOnscr(res.data.Group)
            }
        })
        .catch(err => console.log(err))
    console.log(groupDetails)
}

function showGrpOnscr(GroupObj) {
    const gList = document.getElementById('gpList');
    const li = document.createElement('li');
    li.classList.add('gli');
    li.id = GroupObj.id;

    const button = document.createElement('button');
    button.textContent = GroupObj.groupName;
    button.addEventListener('click', function () {
        lastmsgId = -1;
        getGrp(GroupObj);
    });

    li.appendChild(button);
    gList.appendChild(li);
}

function getGrp(obj) {
    console.log("getgrp mesg", lastmsgId)
    document.getElementById('gpN').textContent = obj.groupName
    document.getElementById('gpD').innerText = obj.description;
    document.getElementById('hid').value = obj.id;
    document.getElementById('addUserBtn').style.display = 'block'
    groupId = obj.id;
    axios.get(`/getmsg?lastmsgId=${lastmsgId}&groupId=${obj.id}`, { headers: { 'Authorizan': token } })
        .then(res => {
            createUlList();
            //   realTimemsg()
            res.data.forEach((el) => {
                lastmsgId = el.id
                showMsgOnScreen(el.user.name, el.message, el.url)
            })
            document.getElementById('sU').style.display = 'none'
        })
        .catch(err => console.log(err))
}

//show Group membar 

function ShowGroupUser() {
    const userSho = document.getElementById('sU')
    const listUl = document.getElementById('mliId')
    listUl.innerHTML = '';
    axios.get(`group/allUsers?groupId=${hidInput.value}`, { headers: { 'Authorizan': token } })
        .then(res => {

            res.data.forEach((el, i) => {
                console.log(el.usergroup.admin)
                const listItem = document.createElement("li");
                listItem.textContent = `${i + 1}. ${el.name}: ${el.email}`

                const groupadmin = document.createElement('span');
                //  adminBtn.setAttribute('id',  user.id); 
                groupadmin.classList.add('Gadmin')
                groupadmin.setAttribute('id', 'Gadmin-' + el.id)
                groupadmin.textContent = 'Group Admin';
                listUl.appendChild(listItem)
                if (el.usergroup.admin) {
                    listItem.appendChild(groupadmin);
                }
                // Show User property
                listItem.addEventListener('click', () => {
                    const userPro = document.getElementById('userProb')
                    const spanEleme = document.createElement('span')
                    spanEleme.setAttribute('id', 'remove-' + i)
                    spanEleme.classList.add('remove-btn')
                    spanEleme.textContent = 'Remove from this group'
                    userPro.appendChild(spanEleme)
                    userPro.style.display = 'block'

                    spanEleme.addEventListener('click', () => {
                        console.log(el.id)
                        axios.post(`/group/removeUser`, { userId: el.id, groupId: hidInput.value }, { headers: { 'Authorizan': token } })
                            .then(res => {
                                confirm(res.data.message)
                                userPro.style.display = 'none'
                                if (res.status == 200) {
                                    listItem.parentNode.removeChild(listItem);
                                    userPro.removeChild(spanEleme)
                                }
                            })
                            .catch(err => console.log(err))
                    })
                })
            })
            userSho.style.display = 'block'
        })
        .catch(err => console.log(err))
}

document.getElementById("close").addEventListener("click", () => {
    document.getElementById("sU").style.display = "none";
    console.log('jay Shree ram')
    document.body.style.overflow = "auto";
});



function showUser(users, id) {
    const userBox = document.getElementById(id);
    userBox.innerHTML = ''; // Clear the existing content

    users.forEach(user => {
        const userElement = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = user.id;
        userElement.appendChild(checkbox);

        const label = document.createElement('label');
        label.setAttribute('id', user.id)
        label.textContent = user.name;
        userElement.appendChild(label);

        const adminBtn = document.createElement('span');
        //  adminBtn.setAttribute('id',  user.id); 
        adminBtn.classList.add('adminBtn')
        adminBtn.setAttribute('id', 'showAdmin-' + user.id)
        adminBtn.textContent = 'Make Admin';
        userElement.appendChild(adminBtn);

        userBox.appendChild(userElement);

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                document.getElementById(`showAdmin-${checkbox.value}`).style.display = 'block'
            }
            else {
                document.getElementById(`showAdmin-${checkbox.value}`).style.display = 'none'
            }
        })
        adminBtn.addEventListener('click', () => {
            if (adminBtn.className == 'adminBtn') {
                console.log('admin btnn ')
                adminBtn.style.color = 'green'
                adminBtn.textContent = 'Remove admin'
                adminBtn.classList.add('rmAdmin')
                adminUser(user.id)
            }
            else {
                adminBtn.style.color = 'red'
                adminBtn.classList.remove('rmAdmin')
                adminBtn.textContent = 'Make Admin'
                idRemove(user.id)
            }

        })
        //////////////////////
    });
}
let adminIds = []
function adminUser(id) {
    adminIds.push(id)
    console.log(adminIds)
}
function idRemove(id) {
    const index = adminIds.indexOf(id);
    if (index !== -1) {
        adminIds.splice(index, 1);
    }
    console.log(adminIds)
}

//sift all in user

const showUserandAdd = document.getElementById('addUserBtn');

showUserandAdd.addEventListener('click', () => {
    const addAndShow = document.getElementById('add-show')
    const div1 = `<div class="hDiv" id="hDiv1">Show User</div>
    <div class="hDiv" id="hDiv2">Add User</div>`
    addAndShow.innerHTML = div1;
    document.getElementById('hDiv1').addEventListener('click', () => {
        ShowGroupUser()
    })
    document.getElementById('hDiv2').addEventListener('click', () => {
        axios.get('/user/getUser').then(res => {
            //showUser(res.data,'addUser-group')
        })
            .catch(err => console.log(err))
    })
    document.getElementById('hDiv2').addEventListener('click', () => {
        document.getElementById('serchInput').style.display = 'flex'
        document.querySelector('#serchInput').style.color = 'red'
    })
})

async function searchUser(event) {
    event.preventDefault()
    const email = event.target.serchU.value;
    const phoneNumber = event.target.serchPhn.value;
    const user = await axios.get(`/user/search?email=${email}&phoneNumber=${phoneNumber}`)
    console.log(user.data)
    if (user.status == 200) {
        adduserInGroup(user.data)
    }
    else {
        confirm(user.data)
    }
}

function adduserInGroup(user) {
    document.getElementById('addUser-group').style.display = 'block'
    document.getElementById('UserName').innerText = `${user.name} : ${user.email}`
    const markAdmin = document.getElementById('idCheck')
    document.getElementById('btnIn1').addEventListener('click', () => {
        let admin = false;
        if (markAdmin.checked) {
            admin = true;
            console.log('markAdmin is checked')
        }
        axios.get(`/group/adduser?groupId=${hidInput.value}&userId=${user.id}&admin=${admin}`, { headers: { 'Authorizan': token } })
            .then(res => {
                console.log(res.data)
                if (res.data.message) {
                    confirm(res.data.message);
                }
            })
    })
}

document.getElementById('clSerch').addEventListener('click', () => {
    document.getElementById('serchInput').style.display = 'none'
})

//media send 

const fileInput = document.querySelectorAll('.fileInput')
fileInput.forEach(item => {
    item.addEventListener("change", (event) => {
        let msg = "img";
        const imagePreview = document.getElementById('image-preview');
        const videoPreview = document.getElementById('videoPreview')
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('image', file);

        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('image-container').style.display = "block"

            if (item.id === "imgInput") {
                imagePreview.style.display = "block"
                imagePreview.src = e.target.result;
            }
            else if (item.id === "vdoInput") {
                videoPreview.style.display = "block"
                videoPreview.src = e.target.result
                msg = "video"
            }
        }
        reader.readAsDataURL(file);

        document.getElementById('sendImg').addEventListener("click", async () => {

            try {
                const response = await axios.post('http://localhost:2000/uploadImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                const post = await axios.post(`/msgpost`, { message: msg, groupId: hidInput.value, url: response.data }, { headers: { 'Authorizan': token } })
              
                socket.emit("send-groupId", hidInput.value)
            }
            catch (err) {
                console.log(err)
            }
            document.getElementById('image-container').style.display = 'none'
            imagePreview.src = "#"
            videoPreview.src = '#'
            imagePreview.style.display = "none";
            videoPreview.style.display = "none"
        })
        document.getElementById('cancel').addEventListener('click', () => {
            document.getElementById('image-container').style.display = 'none'
            imagePreview.src = "#"
            videoPreview.src = '#'
            imagePreview.style.display = "none";
            videoPreview.style.display = "none"
        })
    })

})
