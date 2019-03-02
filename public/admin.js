var options = [{
    name:"Basic",
    cores: 8,
    RAM: "16 GB",
    storage: "20 GB",
    rate:"5 cents/minute"
    
}, 
{
    name:"Large",
    cores: 32,
    RAM: "64 GB",
    storage: "20 GB",
    rate:"10 cents/minute"
    
},
{
    name:"Ultra",
    cores: 128,
    RAM: "512 GB",
    storage: "40 GB",
    rate:"15 cents/minute"
    
},];

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