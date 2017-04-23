var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator').sanitize;
var User = require('../models/user');

function is(myBoolian) {
    return myBoolian ? 1 : 0;
}

// Register
router.get('/register', function (req, res) {
    res.render('register');
});

// Login
router.get('/login', function (req, res) {
    res.render('login');
});

// Register User
router.post('/register', function (req, res) {


    req.sanitizeBody();

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password must be at least 10 char long! Don\'t listen to your girlfriend size matters! At least here :P ').len(10);
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    if (!errors)// if no errors are created by express-validator then errors is undefined ******fuck my life********  ' and ' +
        errors = [];

    var errors = req.validationErrors();
    var hasLowerCase = (/[a-z]/.test(password));
    var hasUpperCase = (/[A-Z]/.test(password));
    var specialChar = (/[!@#$%\^&*)(+=._-]/.test(password));
    var hasNumber = (/[0-9]/.test(password));
    //find if the username is contained in the password ignoring the case(case insensitive).
    var usernameInPass = password.toLocaleLowerCase().indexOf(username.toLocaleLowerCase()) !== 1;

    if ((is(hasLowerCase) + is(hasNumber) + is(specialChar) + is(hasUpperCase)) < 3)
        errors.push({
            param: 'password', msg: ['At least 3/4 password character rules must be met!',
                '1)contain at least one uppercase letter',
                '3)contain at least one lowercase letter',
                '2)contain at least one number',
                '4)contain at least one special character',
            ], value: '1'
        });

    if (usernameInPass && username==true)
        errors.push({param: 'password', msg: 'Using the username in the password in not allowed!', value: ''});

    if (errors) {
        console.log("errors type")
        console.log(typeof errors)
        req.flash('signupMessage', "dsdasdas");
        res.render('register', {
            name:name,
            username:username,
            email:email,
            errors: errors
        });
    } else {
        var newUser = new Object()
        newUser.name = name;
        newUser.email = email;
        newUser.username = username;
        newUser.password = password;


        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log("username:" + username);
        console.log("password:" + password);
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user[0]) {
                return done(null, false, {message: 'Unknown User'});
            }
            console.log('the user is : ' + user);
            User.comparePassword(password, user[0].password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user[0].id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
    function (req, res) {
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

module.exports = router;