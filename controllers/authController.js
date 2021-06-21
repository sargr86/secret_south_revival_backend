const nodemailer = require('nodemailer');

const db = require('../models');
const Users = db.users;
const UserStatuses = db.user_statuses;
const AccountVerifications = db.account_verifications;

const jwt = require('jsonwebtoken');
const hbs = require('nodemailer-express-handlebars');
const bcrypt = require('bcryptjs');

const c = require('../config/constants');
const generateMailOptions = require('../helpers/generateMailOptions');


exports.sendVerificationCode = async (req, res) => {

    let {email, ...data} = req.body;

    let transporter = nodemailer.createTransport(c.NODEMAILER_TRANSPORT_SETTINGS);

    let jwtToken = jwt.sign({email}, 'secret', {expiresIn: "1h"});

    this.saveToken(jwtToken, {email});
    this.register(data, {email});

    // e-mail template settings
    transporter.use('compile', hbs(c.EMAIL_HBS_SETTINGS));

    // setup email data with unicode symbols
    let mailOptions = generateMailOptions(email, jwtToken, 'Account verification code',
        'verification', {verificationLink: `${process.env.FRONTEND_URL}/auth/account-verification?email=${email}&token=${jwtToken}`});

    // send mail with defined transport object
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).json({msg: error.toString()})
        } else if (info) {

            console.log('Message sent: %s', info.messageId);
            res.json(jwtToken);
        }
    });
};

exports.saveToken = async (jwtToken, email) => {
    let found = await AccountVerifications.findOne({where: email});

    if (found) {
        await AccountVerifications.update({secret: jwtToken}, {where: email});
    } else {
        await AccountVerifications.create({...email, secret: jwtToken});
    }
};

exports.verifyCode = async (req, res) => {
    const {token, email} = req.body;

    let s = await AccountVerifications.findOne({where: {email}});
    let verified = s?.secret === token;

    if (verified) {
        let status = await UserStatuses.findOne({where: {name: 'active'}});
        await Users.update({status_id: status.id}, {where: {email}})
    } else {
        res.status(500).json({msg: 'The code verification failed'});
    }
};

exports.register = async (data, email) => {

    // Saving the original password of user and hashing it to save in db
    let originalPass = data.password;
    data.password = bcrypt.hashSync(originalPass, 10);

    // Getting 'not-verified' status to assign it to the user
    let status = await UserStatuses.findOne({where: {name: 'not verified'}});

    await Users.create({...data, ...email, status_id: status.id});

};


exports.login = async (req, res) => {

};
