function formSubmit(e){
    e.preventDefault();

    const userDetaits={
        name:document.getElementById('userName').value,
        email:document.getElementById('email').value,
        password:document.getElementById('password').value,
        phoneNumber:document.getElementById('phn').value
    }

sendUserDetails(userDetaits)
}

async function sendUserDetails(details){
  try{
    const responce=await axios.post(`http://localhost:2000/user/signUp`,details)
    console.log(responce.status)
    if(responce.status===201){
      showError("Successfuly signed up")
    }
     if(responce.status===303){
          throw new Error(responce.data.errors[0].message)
      }
      else{
          throw new Error('Faild to Login')
      }
  }
   catch(err){
  if(err=="Error: Request failed with status code 303"){
    showError("User already exists, Please Login")
  }
  else{
    showError(err)
  }
  console.log(err)
}
}

function showError(message){
        const errorMsg = document.getElementById("error-msg");
        errorMsg.textContent =message;
        errorMsg.classList.add("show");
        setTimeout(function() {
          errorMsg.classList.add("hide");
          setTimeout(function() {
            errorMsg.classList.remove("show");
            errorMsg.classList.remove("hide");
          }, 2000);  
        }, 10000); 
      }