const config = require('../config/constants');
const db = require('../models');
const Users = db.users;
const to = require('../helpers/getPromiseResult');
const GoogleStrategy = require('passport-google-oauth20');


// Strategy config
module.exports = (passport) => {
    passport.use(new GoogleStrategy({
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.API_URL}auth/google/callback`
        },
        async (accessToken, refreshToken, profile, done) => {
            delete profile._json['id'];

            await to(Users.findOrCreate({
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
            done(null, profile);
        }
    ));
};
