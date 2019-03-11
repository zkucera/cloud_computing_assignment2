var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var VmUsageSchema= new Schema({
    user: {type: mongoose.Schema.ObjectId, ref: ('user'), required: true},
    vm: {type: mongoose.Schema.ObjectId, ref: ('vm'), required: true},
    vmType: String,
    eventType: String,
    timeStamp: String
});

module.exports = mongoose.model('VmUsage', VmUsageSchema);