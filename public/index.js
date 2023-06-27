const msgInput = document.getElementById('msginput');
const token = localStorage.getItem('token')

document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        window.location.href = '/login.html'
    } else {
        axios.get('http://localhost:2000/getmsg',{ headers: { 'Authorizan': token } })
            .then(res => {
                res.data.forEach((el)=>{
                    showMsgOnScreen(el.senderName, el.message)
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
        showMsgOnScreen("You", getmessage)
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

document.getElementById('lgout').addEventListener('click',()=>{
    localStorage.removeItem('token')
    window.location.href='/login.html'
})