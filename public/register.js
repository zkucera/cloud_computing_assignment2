var un,pw,pwc
var url = 'http://localhost:8080/api/register';
function RegisterSubmit(){

  un = document.getElementById("un").value //Get the info entered
  pw = document.getElementById("pw").value
  pwc = document.getElementById("pwc").value

  if (pw == pwc){//if the passwords match
    fetch(url, { //Send the register request
      method: 'post',
      headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url},
      body: JSON.stringify({username : un, password : pw})})
      .then(x =>{
        console.log("Registration Successful!: " + x.statusText)
        location.assign("./")
      }).catch(error =>{
        console.log("ERROR! Register did not go through!: " + error)
      })
  }
  else{//if its incorrect
    document.getElementById("pw").value = ""
    document.getElementById("pwc").value = ""
    document.getElementById("un").value = ""
    document.getElementById("Error").innerText = "You must enter matching passwords!"
  }
}