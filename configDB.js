var crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://10.0.0.8:20000/cloudDB',
    secret: crypto
};
