// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs = require('fs');
var cors = require('cors');
var jwt = require('jsonwebtoken');

app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

var router = express.Router();
var User = require('./models/user');
var Vm = require('./models/vm');
var VmUsage = require('./models/vmUsage');
var configDB = require('./configDB');
var mongoose = require('mongoose')
var address = "10.0.0.8"

var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://10.0.0.7:27017";

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 10000 ;        // set our port

// ROUTES FOR OUR API
// =============================================================================

router.route('/vmUsage/:vm_id')
    .get((req,res)=>{
        VmUsage.find((err, vm)=>{
            if (err){
                res.json(err)
            }
            else{
                console.log(vm)
                res.json({ message: vm});
            }
        })
})

//VM Usage
router.route('/vmUsage/:user_id/:vm_id')
    .post((req, response) => { //Adds a VM Usage event to the DB
        var vmUsage = new VmUsage({

        user: req.params.user_id,
        vm: req.params.vm_id,
        vmType: req.body.vmType,
        eventType: req.body.eventType,
        timeStamp: req.body.timeStamp
    })
    vmUsage.save((err,res) => {
        if (err) {
            console.log("VM USAGE EVENT NOT CREATED: " + err)
        }
        else {  
            console.log("VM USAGE EVENT CREATED: " + res._id)
            response.send(res._id)   
        }
    })
})


// middleware to use for all requests
app.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
})

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', express.static(__dirname + '/public'));
app.use('/api',router);




// START THE SERVER
// =============================================================================
//Set up default mongoose connection
//mongoose.connect(configDB.uri, { useNewUrlParser: true });
// Get Mongoose to use the global promise library

MongoClient.connect(mongoURL, function(err,db){
if (err) throw err;
console.log("working");
db.close();
});
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(port,address);
console.log('Magic happens on  ' + address + ":" + port);
