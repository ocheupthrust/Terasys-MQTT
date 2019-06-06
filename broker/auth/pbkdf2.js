var pbkdf2 = require('pbkdf2');
var crypto = require('crypto');

function ConvertToPBKDF2(password) {
    var config = {
        hashBytes: 24,
        saltBytes: 12,
        iterations: 901,
        algorithm: 'sha256'
    };
    var bytes = crypto.randomBytes(config.saltBytes);
    var salt = new Buffer(bytes);
    var derivedKey = pbkdf2.pbkdf2Sync(password, salt.toString('base64'), config.iterations, config.hashBytes, config.algorithm);

    return "PBKDF2$" + config.algorithm + "$" + config.iterations + "$" + salt.toString('base64') + "$" + derivedKey.toString('base64');
}