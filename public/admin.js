var options = [{
    name:"Basic",
    cores: 8,
    RAM: 16,
    storage: 20,
    rate:5
    
}, 
{
    name:"Large",
    cores: 32,
    RAM: 64,
    storage: 20,
    rate:10 
    
},
{
    name:"Ultra",
    cores: 128,
    RAM: 512,
    storage: 40,
    rate:15
    
},];

var url= 'http://localhost:8080/api/vm'
var byUserUrl = 'http://localhost:8080/api/vmByUser'

var userVMs; 
var userID = localStorage.getItem("userID"); //Get the username from the webtoken

function updateConfig(){
    var x = document.getElementById("config").value;
    
    var selected  = options.find(element => {
        return element.name == x
    });

    if (x){
        document.getElementById("cores").innerHTML = "Number of Cores: " + selected.cores;
        document.getElementById("RAM").innerHTML = "RAM: " + selected.RAM;
        document.getElementById("storage").innerHTML = "Storage Space: " + selected.storage;
        document.getElementById("rate").innerHTML = "Rate: " + selected.rate;
    }
}

function requestVM(){
    var x = document.getElementById("config").value;
    
    var selected  = options.find(element => {
        return element.name == x
    });
    if (x){ //If we have a name
        vm ={ //Create the VM object
            owner:userID, 
            name: document.getElementById('name').value,
            config:{
                name: selected.name,
                cores: selected.cores,
                RAM: selected.RAM,
                storage:selected.storage,
                rate: selected.rate
            }
        }
        createVM(vm);         
    }
    
}

function addVM(vm){
    console.log(vm)
        var cores = vm.config.cores
        var ram = vm.config.RAM
        var storage = vm.config.storage
        var rate = vm.config.rate
        var name = vm.name
        var node = document.createElement('div');
        node.innerHTML = '<label>Name: ' + name + '</label><br><label>RAM: '
        + ram + ' GB</label><br><label>Storage: ' 
        + storage + ' GB</label><br><label>Cores: '
        + cores + '</label><br><label>Rate: ' 
        + rate + 'cents/minute</label><br><button onclick = "upgrade(' 
        + "\'" + vm._id + "\',\'" + vm.config.name + '\')">Upgrade</button><button onclick = "downgrade('
        + "\'" + vm._id + "\',\'" + vm.config.name + '\')">Downgrade</button><br><button onclick = "remove('
        + "\'" + vm._id + '\')">Remove</button><br><button onclick = "startVM('
        + "\'" + vm._id + '\')">Start</button><button onclick = "stopVM('
        + "\'" + vm._id + '\')">Stop</button><br><br>';       
        document.getElementById('container').appendChild(node);
        

        
}

function  createVM(vm){
        fetch(url, { //Send the creation request
        method: 'post',
        mode: "cors",
        headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url},
        body: JSON.stringify(vm)}).then(data =>{
            return data.json()
        })
        .then(ID =>{
            vm = {name: vm.name, _id: ID, config: vm.config}
            console.log("CREATE VM NEW VM: " + vm)
            addVM(vm)
        })
    }

function onLoad(){
    var temp = document.getElementById('container').children.length
    for (i = 0; i < temp; i++){
        console.log("Removing child number:" + i)
        document.getElementById('container').children[0].remove();
    }
    fetch(byUserUrl + "/" + userID, { //Get the vms of the current user
        method: 'get',
        mode: "cors",
        headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url},
        }).then(data =>{
            return data.json()
        })
        .then(vms =>{
            userVMs = vms //save their vms
            for (i = 0; i<userVMs.length; i++){ //For each one, display its info
                addVM(userVMs[i])
            }
        })

    
}

function upgrade(id, configName){
    var temp  = options.findIndex(element => {
        return element.name == configName
    });
    console.log("Current Config: " + temp)
    console.log("VM ID:" + id)
    if (temp == options.length - 1){
        console.log("Already at the maximum upgrade!")
    }
    else{
        temp = options[temp + 1];//Get the config that we need to upgrade to
        console.log("New Config: " + temp.name)
        fetch(url + "/" + id, { //Send the creation request
            method: 'put',
            mode: "cors",
            headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url},
            body: JSON.stringify(temp)}).then(data =>{
                return data.json()
            })
            .then(stuff =>{
                console.log(stuff)
                onload()
            })

        

    }
}

function downgrade(id, configName){
    var temp  = options.findIndex(element => {
        return element.name == configName
    });
    if (temp == 0){
        console.log("Already at the minimum upgrade")
    }
    else{
        temp = options[temp - 1];//Get the config that we need to downgrade to
        fetch(url + "/" + id, { //Send the creation request
            method: 'put',
            mode: "cors",
            headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url},
            body: JSON.stringify(temp)}).then(data =>{
                return data.json()
            })
            .then(stuff =>{
                console.log(stuff)
                onload()
            })
    }
}

function remove(id){
    fetch(url + "/" + id, { //Remove the VM
        method: 'delete',
        headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url}})
        onload()
    }

function startVM(id){
    console.log("Starting VM: " + id)
}

function stopVM(id){
    console.log("Stopping VM: " + id)
}

function logout(){
    window.localStorage.removeItem("userID")
    location.assign("./")
}