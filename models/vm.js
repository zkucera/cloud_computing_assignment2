var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var VmSchema= new Schema({
    owner: String,
    name: String,
    config:{
        name: String,
        cores: Number,
        RAM: Number, // in GB
        storage: Number, // in GB
        rate:Number // in c/min
    }

});

module.exports = mongoose.model('Vm', VmSchema);