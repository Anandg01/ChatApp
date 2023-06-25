function formSubmit(e){
    e.preventDefault();

    const userDetaits={
        name:document.getElementById('userName').value,
        email:document.getElementById('email').value,
        password:document.getElementById('password').value,
        phoneNumber:document.getElementById('phn').value
    }
const cnfpassword=document.getElementById('cnfpassword').value
console.log(cnfpassword, userDetaits)
//for showing error message
if(cnfpassword!==userDetaits.password){
    showError("Incorrect Does not matched. Please try again.")
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