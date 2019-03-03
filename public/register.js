var un,pw,pwc
function RegisterSubmit(){

  un = document.getElementById("un").value //Get the login info entered
  pw = document.getElementById("pw").value
  pwc = document.getElementById("pwc").value

  if (pw == pwc){//if its the correct login info
    location.assign("./")
  }
  else{//if its incorrect
    document.getElementById("pw").value = ""
    document.getElementById("pwc").value = ""
    document.getElementById("un").value = ""
    document.getElementById("Error").innerText = "Invalid Credentials!"
  }
}