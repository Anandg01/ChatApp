
const msgInput = document.getElementById('msginput');
const token = localStorage.getItem('token')
const storagemsg = localStorage.getItem('storeMsg');
const arrst = JSON.parse(storagemsg)
let lastmsgId = -1
let bkcontainer = [];
if (arrst) {
    const n = arrst.length - 1;
    bkcontainer=arrst;
    if (arrst[n]) {
        createUlList();
        console.log(arrst)
        arrst.forEach((el) => {
            showMsgOnScreen(el.senderName, el.message)
        })
        lastmsgId = arrst[n].messageId
        console.log("this is local stofrage", lastmsgId)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        window.location.href = '/login.html'
    }
    else {
        axios.get(`http://localhost:2000/getmsg?lastmsgId=${lastmsgId}`, { headers: { 'Authorizan': token } })
            .then(res => {
                if (lastmsgId == -1) {
                    createUlList()
                }
                res.data.forEach((el) => {
                    bkcontainer.push(el);
                    if(bkcontainer.length>10){
                        bkcontainer.shift();
                    }
                    lastmsgId = el.messageId
                    showMsgOnScreen(el.senderName, el.message)
                    localStorage.setItem('storeMsg', JSON.stringify(bkcontainer))

                })
            })
            .catch(err => console.log(err))
    }
})

msgInput.addEventListener('submit', async (event) => {
    event.preventDefault()
    const message = event.target.sendmsg.value
    try {
        const post = await axios.post(`http://localhost:2000/msgpost`, { message: message }, { headers: { 'Authorizan': token } })
        const getmessage = post.data.message;
        //    showMsgOnScreen("You", getmessage)
        document.getElementById('sendmsg').value = '';
    }
    catch (err) {

    }
})

function showMsgOnScreen(senderName, message) {
    const listUl = document.getElementById('ulitem')
    const listItem = document.createElement("li");
    listItem.textContent = `${senderName}: ${message}`
    listUl.appendChild(listItem)
}

//for log out

document.getElementById('lgout').addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.href = '/login.html';
})

setInterval(async () => {
    try {
        const allmsg = await axios.get(`/getmsg?lastmsgId=${lastmsgId}`, { headers: { 'Authorizan': token } })
        // createUlList();
        allmsg.data.forEach((el) => {
            lastmsgId = el.messageId;
            bkcontainer.push(el)
            if(bkcontainer.length>10){
                bkcontainer.shift();
            }
            localStorage.setItem('storeMsg', JSON.stringify(bkcontainer))
            console.log(bkcontainer)
            console.log('lasmst id',lastmsgId)
            showMsgOnScreen(el.senderName, el.message)
        })
    }
    catch (err) {
        console.log(err)
    }
}, 1000)
function createUlList() {
    const divlist = document.getElementById("msgCont");
    const ullis = ` <ul class="licon" id="ulitem"></ul>`
    divlist.innerHTML = ullis;
}