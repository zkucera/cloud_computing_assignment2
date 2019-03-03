var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var vm = new Schema({
    id: Number,
    owner: String,
    name: String,
    config:{
        cores: Number,
        RAM: Number, // in GB
        storage: Number, // in GB
        rate:Number // in c/min
    }

});

module.exports = mongoose.model('VM', vm);