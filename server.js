// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var url = require('url')
var fs = require('fs')
var cors = require('cors')
app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

var router = express.Router();
var User = require('./models/user');
var Vm = require('./models/vm');
var configDB = require('./configDB');

var mongoose = require('mongoose')

var address = "127.0.0.1"


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port
// ROUTES FOR OUR API
// =============================================================================
//Route for registering users
router.route('/register')
    .post((req, res) => {
        if(!req.body.username){
            res.json({message: 'You must give a username', success: 'false'});
        }
        else if(!req.body.password){
            res.json({message: 'You must give a password', success: 'false'});
        }
        else{
            var user = new User({
                username: req.body.username,
                password: req.body.password
            })
            user.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                     res.json({ success: false, message: 'Username already exists' }); // Return error
                    } 
                    else {
                        if(err.errors){
                            if(err.errors.username){
                                res.json({ message: err.errors.username.message, success: false});
                            }
                            else if(err.errors.password){
                                res.json({ message: err.errors.password.message, success: false});
                            }
                            else{
                                res.json({ message: 'Could not save the user', success: false});
                            }
                        }
                    }
                }
                else{
                    res.json({ message: 'Account successfully registered', success: true});
                }
            })
        }
    })

    .get((req, res) => {
        User.find((err, register) => {
            if (err){
                res.json({ message: err, success: false});
            }
            res.json(register);
        });
    });

//route for modifying registered users    
router.route('/register/:user_id')

        .put((req, res)=> {
        User.findById(req.params.user_id, (err, user)=> {
            if (err){
                res.json(err);
            }
            user.name = req.body.name;
            user.save(function(err) {
                if (err){
                    res.json(err);
                }
            res.json({ message: 'User updated!' });    
            });
        });
    })

    .delete((req, res) => {
        User.remove({
            _id: req.params.user_id
        }, (err, user) => {
            if (err){
                res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    });

//route for login component    
router.route('/login')

    .post((req,res) =>{
        if(!req.body.username){
            res.json({ message: 'You must enter a username', success: false});
        }
        else if(!req.body.password){
            res.json({ message: 'You must enter a password', success: false});
        }
        else{
            User.findOne({username: req.body.username.toLowerCase()}, (err,user) => {
                if(err){
                    res.json({ message: err, success: false});
                }
                else if(!user){
                    res.json({ message: "Username not found", success: false});
                }
                else{
                    if(!user.comparePassword(req.body.password)){
                        res.json({ message: "Wrong password", success: false});
                    }
                    else{
                        var token = jwt.sign({userID: user._id, expiresIn: '12h'}, configDB.secret);
                        res.json({ message: "Successful login", success: true, token: token, user: {username: user.username}});
                    }
                }
            })
        }
    });

//Route for creating VM's
router.route('/vm') 
.post((req,response) =>{
    var vm = new Vm({
        // Contain the user ID owner: userID
        name : req.body.name,
        config : req.body.config           
    })
    vm.save((err,res) =>{
        if (err){
            console.log("VM NOT CREATED: " + err)
        }
        else{  
            console.log("VM CREATED: " + res._id + "," + res.config.name)
            response.send(res._id)
            
        }
    })
    
})

.get((req, res)=>{
    Vm.find(function(err,vms){
        if (err){
            res.send(err)
        }
        else{
            res.json(vms);
        }
    
    })
})
.delete((req,res) =>{
    Vm.remove(function(err, vm) {
        if (err)
            res.send(err);

        res.json({ message: 'VMS REMOVED' });
    });
})

//Route for editing VMs
router.route('/vm/:vm_id')
        .put((req, res)=> {
        Vm.findById(req.params.vm_id, (err, vm)=> {
            if (err){
                res.json(err);
            }
            console.log(req.body)
            vm.name = req.body.name;
            vm.config = req.body.config;
            vm.save(function(err) {
                if (err){
                    res.json(err);
                }
            res.json({ message: 'User updated!' });    
            });
        });
    })

    .get((req,res)=>{
        Vm.findById(req.params.vm_id, (err, vm)=>{
            if (err){
                res.json(err)
            }
            else{
                res.json(vm)
            }
        })
    })

    .delete((req, res) => {
        console.log(req.params.vm_id)
        Vm.remove({
            _id: req.params.vm_id
        }, (err, vm) => {
            if (err){
                res.send(err);
            }
            else{res.json({ message: 'VM Successfully deleted' });}

        });
    });

//TODO: Get rid of this, just testing
router.route('/test') 
    .get((req, res)=>{
        User.find(function(err,users){
            if (err) res.send(err)

            res.json(users);
        })
    })

// middleware to use for all requests
app.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.get('/', function(req, res) { 
    fs.readFile("public/login.html", function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }  
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
});

app.get('/signup', function(req, res){ 
    fs.readFile("public/signup.html", function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }  
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
})

app.get('/register', function(req, res){ 
    fs.readFile("public/register.html", function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }  
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
})

app.get('/admin', function(req, res) { 
    fs.readFile("public/admin.html", function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }  
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', express.static(__dirname + '/public'));
app.use('/api',router);




// START THE SERVER
// =============================================================================
//Set up default mongoose connection
mongoose.connect(configDB.uri, { useNewUrlParser: true });
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(port,address);
console.log('Magic happens on  ' + address + ":" + port);
