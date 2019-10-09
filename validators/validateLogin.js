// Express Validator
const {body} = require('express-validator');
const db = require('../models');
const Users = db.users;
const bcrypt = require('bcryptjs');

const rules = [
    body('email').not().isEmpty().withMessage('E-mail is required').isEmail().withMessage('E-mail is invalid'),
    body('password', 'Password is required').not().isEmpty(),
    body().custom(async (req) => {
        let email = req.email;
        let pass = req.password;

        // Checking email existence & passwords match
        let found = await Users.findOne({where: {email: email}});
        if (!found) throw new Error('A user with such email doesn\'t exist');
        // let match = await bcrypt.compare(pass, found.password);

        // Passwords mismatch case
        // if (!match) throw new Error('Wrong password')
    })
];

module.exports = {
    rules
};
