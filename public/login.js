  var USERNAME,PASSWORD,un,pw
  function loginSubmit(){
    USERNAME = "username";
    PASSWORD = "password";

    un = document.getElementById("un").value //Get the login info entered
    pw = document.getElementById("pw").value

    if (un == USERNAME && pw == PASSWORD){//if its the correct login info
      location.assign("./admin")
    }
    else{//if its incorrect
      document.getElementById("pw").value = ""
      document.getElementById("un").value = ""
      document.getElementById("Error").innerText = "Invalid Credentials!"
    }
  }