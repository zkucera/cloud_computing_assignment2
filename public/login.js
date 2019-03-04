  var un,pw
  var url = 'http://localhost:8080/api/login';
  function loginSubmit(){

    un = document.getElementById("un").value //Get the login info entered
    pw = document.getElementById("pw").value

    fetch(url, { //Send the login request
      method: 'post',
      headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url},
      body: JSON.stringify({username : un, password : pw})})
        
      
      //location.assign("./admin")
    
    //if its incorrect
      document.getElementById("pw").value = ""
      document.getElementById("un").value = ""
      document.getElementById("Error").innerText = "Invalid Credentials!"
    
  }