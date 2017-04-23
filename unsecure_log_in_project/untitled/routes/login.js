/**
 * Created by Athinodoros on 4/11/2017.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql')


var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'pwd',
    database: 'security'
});
/* GET users listing. */
router.post('/', function (req, res, next) {
    var name = req.body.username;
    var pass = req.body.password;
    // connection.connect(function (err) {
    //     if (err) throw err

    var query = 'SELECT username from security.login where username = "' + name + '" and password = "' + pass + '";';
    console.log(name);
    console.log(pass);
    console.log(query);
    console.log('You are now connected...');
    connection.query(query, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render("login", {user: result})
    })
    // });
});

router.get('/', function (req, res, next) {
    var name = req.param("username");
    var pass = req.param("password");
    // connection.connect(function (err) {
    //     if (err) throw err

    var query = 'SELECT * from security.login where username = "' + name + '" and password = "' + pass + '";';

    console.log(name);
    console.log(pass);
    console.log(query);
    // console.log('You are now connected...')
    if (name && pass) {
        connection.query(query, function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result.length > 0) {
                console.log("name and pass was correct");
                res.render('login', {user: result});

            }else{
                res.render("index",{name: name,failed:"please try again, \n your log in failed"});
            }
        });
    }
    else
        res.render("index");

    // });
});
module.exports = router;
