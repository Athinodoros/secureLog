/**
 * Created by Athinodoros on 4/23/2017.
 */
var bcrypt = require('bcrypt');
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');
global.appRoot = path.resolve(__dirname);

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'pwd',
    database: 'security'
});


module.exports.createUser = function (incommingSecureUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        var pepper =    fs.readFileSync(__dirname+ "/.."+"/mysuperpepper").toString();
        console.log(pepper)
        bcrypt.hash(incommingSecureUser.password + pepper, salt, function (err, hash) {
            incommingSecureUser.password = hash;
            connection.query('INSERT INTO secureuser SET ?', incommingSecureUser, callback);
        });
    });
};


module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    query = "select * from secureuser where ? = username";
    connection.query(query, username, function (err, ress) {
        console.log(ress)
        console.log('asdasd')
        callback(null, ress);
    });
}

module.exports.getUserById = function (id, callback) {
    query = "select * from secureuser where ?= id";
    connection.query(query, id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    console.log(hash)
    console.log(candidatePassword)
    var pepper = fs.readFileSync(__dirname + "/.." + "/mysuperpepper").toString();
    console.log(pepper)
    bcrypt.compare(candidatePassword + pepper, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};