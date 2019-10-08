const User = require('../models/users');
const passport = require('passport');
const session = require('express-session');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./config/constants');
module.exports = function(passport) {

console.log('aaaa')
    passport.use(new FacebookStrategy({
        clientID: config.FACEBOOK_APP_ID,
        clientSecret: config.FACEBOOK_APP_SECRET,
        callbackUrl: 'http://localhost:3000/auth/facebook/callback'
    }, (accessToken, refreshToken, profile, done) => {
        console.log(accessToken)
    }));


    // passport.use(
    //     new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    //         // Match user
    //         User.findOne({
    //             email: email
    //         }).then(user => {
    //             if (!user) {
    //                 return done(null, false, { message: 'That email is not registered' });
    //             }
    //
    //             // Match password
    //             bcrypt.compare(password, user.password, (err, isMatch) => {
    //                 if (err) throw err;
    //                 if (isMatch) {
    //                     return done(null, user);
    //                 } else {
    //                     return done(null, false, { message: 'Password incorrect' });
    //                 }
    //             });
    //         });
    //     })
    // );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        // User.findById(id, function(err, user) {
        //     done(err, user);
        // });
    });
};
