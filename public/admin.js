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
        addVM(vm); //Add the vm to the list on screen
        createVM(vm);//Create the vm
    }
    
}

function addVM(vm){
        var cores = vm.config.cores
        var ram = vm.config.RAM
        var storage = vm.config.storage
        var rate = vm.config.rate
        var name = vm.name
        var id = vm.id
        var node = document.createElement('div');
        node.innerHTML = '<label>Name: ' + name + '</label><br><label>RAM: '
        + ram + ' GB</label><br><label>Storage: ' 
        + storage + ' GB</label><br><label>Cores: '
        + cores + '</label><br><label>Rate: ' 
        + rate + 'cents/minute</label><br><button onclick = "upgrade(' 
        + id + ')">Upgrade</button><button onclick = "downgrade('
        + id + ')">Downgrade</button><br><button onclick = "remove('
        + id + ')">Remove</button><br><button onclick = "startVM('
        + id + ')">Start</button><button onclick = "stopVM('
        + id + ')">Stop</button><br><br>';       
        document.getElementById('container').appendChild(node);

        
}

function createVM(vm){
    fetch(url, { //Send the creation request
        method: 'post',
        headers: {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : url},
        body: JSON.stringify(vm)})
}

function onLoad(){
    //for each vm the user owns (i = 0; i<vms.length; i++){
    //    addVM(vms[i])
    //}
}

function upgrade(id){
    console.log("Upgrading VM:" + id)
}

function downgrade(id){
    console.log("Downgrading VM: " + id)
}

function remove(id){
    console.log("Removing VM:" + id)
}

function startVM(id){
    console.log("Starting VM: " + id)
}

function stopVM(id){
    console.log("Stopping VM: " + id)
}