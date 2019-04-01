  var un,pw
  var url = 'http://40.76.195.90:8080/api/login';

  function onload(){//Called when the page is loaded, if the user has a web token, send them to the landing page
    if (window.localStorage.getItem("userID")){
      location.assign('./admin.html')
    }
  }

  function loginSubmit(){//Called when the user attempts to login
    un = document.getElementById("un").value //Get the login info entered
    pw = document.getElementById("pw").value
    un.toLowerCase();
    console.log("yo");
    fetch(url, { //Send the login request
      method: 'post',
      headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url},
      body: JSON.stringify({username : un, password : pw})})
      .then(function(res){
        return res.json()
        .then(function(res){//If the login is a success
          window.localStorage.setItem("userID" , res.user.id) //TODO: Stores the user ID in local storage, probably a horrible way to do this.
          location.assign("./admin.html") //Send them to the landing page
        })
      }).catch(err =>{ 
        //if its incorrect
        document.getElementById("pw").value = ""
        document.getElementById("un").value = ""
        document.getElementById("Error").innerText = "Invalid Credentials!"
      })
      
   
  }
