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
    if (x){
        vm ={ 
            owner:"zach", //TODO: Going to be the username of the logged in user
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

function addVM(vm,id){
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
        + id + ",\'" + vm.config.name + '\')">Upgrade</button><button onclick = "downgrade('
        + id + "," + vm.config.name + ')">Downgrade</button><br><button onclick = "remove('
        + id + ')">Remove</button><br><button onclick = "startVM('
        + id + ')">Start</button><button onclick = "stopVM('
        + id + ')">Stop</button><br><br>';       
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
            console.log(ID)
            addVM(vm,ID)
        })
    }

function onLoad(){
    //for each vm the user owns (i = 0; i<vms.length; i++){
    //    addVM(vms[i])
    //}
}

function upgrade(id, configName){
    var temp  = options.findIndex(element => {
        return element.name == configName
    });
    if (temp == options.length){
        console.log("Already at the maximum upgrade!")
    }
    else{
        temp = options[temp + 1];//Get the config that we need to upgrade to
        //TODO: When we have the id of the VM, edit it with the new config
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
        //TODO: When we have the id of the VM, edit it with the new config
    }
}

function remove(id){
    fetch(url + "/" + id, { //Remove the VM
        method: 'delete',
        headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url}})
}

function startVM(id){
    console.log("Starting VM: " + id)
}

function stopVM(id){
    console.log("Stopping VM: " + id)
}