var url= 'http://localhost:8080/api/vm'
var byUserUrl = 'http://localhost:8080/api/vmByUser'

var userVMs; //The user's vms
var userID = localStorage.getItem("userID"); //Get the username from the webtoken

function updateConfig(){ //When the user selects a config, this updates the rest of the fields with the relavent info
    var x = document.getElementById("config").value;//Get the selected config name
    var selected  = options.find(element => {//get the config by searching by name
        return element.name == x
    });

    if (x){//Update the fields
        document.getElementById("cores").innerHTML = "Number of Cores: " + selected.cores;
        document.getElementById("RAM").innerHTML = "RAM: " + selected.RAM;
        document.getElementById("storage").innerHTML = "Storage Space: " + selected.storage;
        document.getElementById("rate").innerHTML = "Rate: " + selected.rate;
    }
}

function requestVM(){ //Called when the user requests a new vm
    var x = document.getElementById("config").value;//Get the selected config
    
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

function addVM(vm){ //Adds vm's info to the frontend, gives the user options to upgrade, downgrade, remove, etc
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
        + "\'" + vm._id + '\')">Stop</button><br><label id = "status' + vm._id + '" style = "color: red"></label><br><br>';       
        document.getElementById('container').appendChild(node);
        

        
}

function  createVM(vm){ //Send the vm request to the backend
        fetch(url, { //Send the creation request
        method: 'post',
        mode: "cors",
        headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url},
        body: JSON.stringify(vm)}).then(data =>{
            return data.json()
        })
        .then(ID =>{ //If no error, update the UI with the new VM
            vm = {name: vm.name, _id: ID, config: vm.config}
            addVM(vm)
        })
    }

function onLoad(){ //Called when the page loads
    var temp = document.getElementById('container').children.length
    for (i = 0; i < temp; i++){ //Remove the vms currently being displayed
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

function upgrade(id, configName){ //Upgrades the vm selected
    var temp  = options.findIndex(element => { //Finds the config of the vm
        return element.name == configName
    });
    if (temp == options.length - 1){ //If the vm is already at the max upgrade,
        document.getElementById('status' + id).innerHTML = "Already at maximum upgrade!"
    }
    else{//if it is upgradable
        temp = options[temp + 1];//Get the config that we need to upgrade to
        fetch(url + "/" + id, { //Send the update request
            method: 'put',
            mode: "cors",
            headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url},
            body: JSON.stringify(temp)}).then(data =>{
                return data.json()
            })
            .then(stuff =>{
                console.log(stuff)
                onload()//Refresh the list of VM's to include the updated info
            })

        

    }
}

function downgrade(id, configName){//Used to downgrade a vm
    var temp  = options.findIndex(element => {//Get the current config
        return element.name == configName
    });
    if (temp == 0){//If the vm is already at the lowest package
        document.getElementById('status' + id).innerHTML = "Already at minimum upgrade!"
    }
    else{//If it can be downgraded further
        temp = options[temp - 1];//Get the config that we need to downgrade to
        fetch(url + "/" + id, { //Send the update request
            method: 'put',
            mode: "cors",
            headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url},
            body: JSON.stringify(temp)}).then(data =>{
                return data.json()
            })
            .then(stuff =>{
                onload()//Refresh the list of VMs
            })
    }
}

function remove(id){//Used to remove a vm
    fetch(url + "/" + id, { //Remove the VM
        method: 'delete',
        headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url}})
        onload()//Refresh the list of VMs
    }

function startVM(id){ //TODO: GOING TO START THE VM
    console.log("Starting VM: " + id)
}

function stopVM(id){ //TODO: GOING TO STOP THE VM
    console.log("Stopping VM: " + id)
}

function logout(){ //Logs the user out
    window.localStorage.removeItem("userID") //Gets rid of the token in local storage
    location.assign("./")//Send them to the home page
}

var options = [{ //The different configurations for VM's
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