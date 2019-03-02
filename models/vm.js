var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var vm = new Schema({
    id: String,
    owner: String,
    config:{
        owner: String,
        cores: number,
        RAM: number, // in GB
        storage: number, // in GB
        rate:number // in c/min
    }

});

module.exports = mongoose.model('VM', vm);