const nodemailer = require('nodemailer');

const db = require('../models');
const Users = db.users;
const UserStatuses = db.user_statuses;
const AccountVerifications = db.account_verifications;

const jwt = require('jsonwebtoken');
const hbs = require('nodemailer-express-handlebars');
const bcrypt = require('bcryptjs');


exports.sendVerificationCode = async (req, res) => {

    let {email, ...data} = req.body;

    let transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SERVICE,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    // let randomCode = Math.floor(100000 + Math.random() * 900000);
    let jwtToken = jwt.sign({email}, 'secret', {expiresIn: "1h"});

    this.saveToken(jwtToken, {email});
    this.register(data, {email});


    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Secret South " <foo@example.com>',
        to: email,
        subject: 'Verification code',
        text: 'Verification code',
        context: {
            verificationLink: `${process.env.FRONTEND_URL}/auth/account-verification?email=${email}&token=${jwtToken}`
        },
        template: 'verification'
    };

    // e-mail template settings
    transporter.use('compile', hbs({
        viewEngine: {
            extName: '.hbs',
            partialsDir: './public/email_templates/',
            layoutsDir: './public/email_templates/',
            defaultLayout: 'verification.hbs',
        },

        viewPath: './public/email_templates/',
        extName: '.hbs',
    }));

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

    console.log(s?.secret + '!!!!!' + token, s?.secret === token)
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
