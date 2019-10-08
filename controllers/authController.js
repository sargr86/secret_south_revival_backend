const passport = require('passport');
const session = require('express-session');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config/constants');


exports.login = (req, res) => {


    passport.authenticate('facebook', {scope: 'read_stream'},(t)=>{
        console.log(t)
    });

    res.json('OK')
};

exports.register = (req, res) => {

};
