const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRegister = require('../validators/validateRegister');
const validateLogin = require('../validators/validateLogin');
const jwt = require('jsonwebtoken');

router.post('/register', validateRegister.rules, authController.register);
router.post('/login', validateLogin.rules, authController.login);


const passport = require('passport');
const session = require('express-session');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const config = require('../config/constants');
const db = require('../models');
const Users = db.users;

const to = require('../helpers/getPromiseResult');

// Strategy config
passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        delete profile._json['id'];
        let user = await to(Users.findOrCreate({
                where: {
                    email: profile._json.email
                },
                defaults: {
                    first_name: profile._json.given_name,
                    last_name: profile._json.family_name,
                    access_token: accessToken
                },

            }).spread((item) => {
                return item.get({
                    plain: true
                });
            })
        );
        done(null, profile); // passes the profile data to serializeUser
    }
));


passport.use(new FacebookStrategy({
        clientID: config.FACEBOOK_APP_ID,
        clientSecret: config.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'emails', 'name']
    },
    async (accessToken, refreshToken, profile, cb) => {
        delete profile._json['id'];
        let user = await to(Users.findOrCreate({
                where: {
                    email: profile._json.email
                },
                defaults: {
                    first_name: profile._json.first_name,
                    last_name: profile._json.last_name,
                    access_token: accessToken
                },

            }).spread((item) => {
                return item.get({
                    plain: true
                });
            })
        );
        cb(null, user);
    }
));

var FacebookTokenStrategy = require('passport-facebook-token');

passport.use(new FacebookTokenStrategy({
        clientID: config.FACEBOOK_APP_ID,
        clientSecret: config.FACEBOOK_APP_SECRET,
        // profileFields: ['id', 'emails', 'name']
    }, async (accessToken, refreshToken, profile, cb) => {
        delete profile._json['id'];
        let user = await to(Users.findOrCreate({
            where: {
                email: profile._json.email
            },
            defaults: {
                first_name: profile._json.first_name,
                last_name: profile._json.last_name
            }
        }).spread((item) => {
            return item.get({
                plain: true
            });
        }));
        cb(null, user);

    }
));


router.get('/facebook', passport.authenticate('facebook', {session: false}));
router.get('/google', passport.authenticate('google', {session: false, scope: ['profile', 'email']},));

router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    scope: ['email', 'openid', 'profile'],
    session: false
}), (req, res) => {
    let token = jwt.sign(req.user, 'secretkey', {expiresIn: '8h'});
    res.redirect(`http://localhost:4201/?token=${token}`);
});

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    scope: ['email', 'openid', 'profile'],
    session: false
}), (req, res) => {
    let token = jwt.sign(req.user, 'secretkey', {expiresIn: '8h'});
    res.redirect(`http://localhost:4201/?token=${token}`);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send('ok')
});


// router.post('/facebook/token',
//     passport.authenticate('facebook-token', {session: false}, {},
//         function (req, res) {
//             console.log('bbb')
//
//             // do something with req.user
//             res.send(req.user[0]);
//         })
// );

router.post('/facebook/token', passport.authenticate('facebook-token', {session: false}), (req, res) => {
    if (!req.user) {
        return res.send(401, 'User Not Authenticated');
    } else {
        let token = jwt.sign(req.user, 'secretkey', {expiresIn: '8h'});
        res.json({token});
    }
});


module.exports = router;

