function formSubmit(e){
    e.preventDefault();

    const userDetaits={
        name:document.getElementById('userName').value,
        email:document.getElementById('email').value,
        password:document.getElementById('password').value,
        phone:document.getElementById('phn').value
    }
console.log(userDetaits)
sendUserDetails(userDetaits)
}

async function sendUserDetails(details){
  try{
    const responce=await axios.post(`http://localhost:2000/user/signUp`,details)
    console.log(responce.status)
    if(responce.status==201){
      showMessage("Successfuly signed up")
    }
    else if(responce.status==303){
          throw new Error(responce.data.errors[0].message)
      }
      else{
        console.log(responce.status)
          throw new Error('Faild to Login')
      }
  }
   catch(err){
  if(err=="Error: Request failed with status code 303"){
    showMessage("Email already exists, Login **")
  }
  else{
    showMessage(err)
  }
  console.log(err)
}
}

function showMessage(message){
  document.getElementById('message').innerHTML=`<p class="msg">${message}</p>`
}