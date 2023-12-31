async function login(e){
e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
const usercred={
  email:username,
  password:password
}
try{
  const validate = await axios.post(`http://localhost:2000/user/login`, usercred)
showMessage(validate.data.message)
if(validate.status==200){
  window.location.href='/index.html';
  localStorage.setItem('token', validate.data.token)
  alert(validate.data.message)
}
}
catch(err){
console.log(err)
showMessage(err)
}
};


function showMessage(message){
  document.getElementById('message').innerHTML=`<p class="msg">${message}</p>`
}

document.addEventListener('DOMContentLoaded',()=>{
  const token=localStorage.getItem('token');
  if(token){
 window.location.href='/index.html'
  }
})