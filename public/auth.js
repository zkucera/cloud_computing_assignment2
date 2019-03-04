var logUser, logToken;

function LogoutUser(){
    this.logUser, this.logToken = null;
    localStorage.clear();
}

function SaveUser(user, token){
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', JSON.stringify(token));
    this.logUser = user;
    this.logToken = token;
}

//Check token to see if user is logged in
function LoggedInUser(){

}