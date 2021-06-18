const nodemailer = require('nodemailer');

const db = require('../models');
const Users = db.users;
const AccountVerifications = db.account_verifications;
const jwt = require('jsonwebtoken');
const hbs = require('nodemailer-express-handlebars');

const jwtDecode = require('jwt-decode');

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
    console.log(jwtToken)
    let found = await AccountVerifications.findOne({where: {email: email}});

    if (found) {
        let d = {secret: jwtToken}
        await AccountVerifications.update(d, {where: {email: email}});
    } else {
        await AccountVerifications.create({email: email, secret: jwtToken});
    }

    await Users.create({...data, email, is_verified: 0});


    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Secret South " <foo@example.com>',
        to: email,
        subject: 'Verification code',
        text: 'Verification code',
        context: {
            verificationLink: `http://localhost:4200/auth/account-verification?email=${email}&token=${jwtToken}`
        },
        template: 'verification'
        // html: `${jwtToken}`
    };

    transporter.use('compile', hbs({
        viewEngine: {
            extName: '.hbs',
            partialsDir: './public/email_templates/',
            layoutsDir: './public/email_templates/',
            defaultLayout: 'verification.hbs',
        },

        //viewEngine: 'express-handlebars',
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

exports.verifyCode = async (req, res) => {
    const {token, email} = req.body;

    let s = await AccountVerifications.findOne({where: {email}});
    let verified = s?.secret === token;
    console.log(s?.secret + '!!!!!' + token, s?.secret === token)
    if (verified) {
        this.register(token)
    } else {
        res.status(500).json({msg: 'The code verification failed'});
    }
};

exports.register = async (token) => {
    console.log(jwtDecode(token))
};


exports.login = async (req, res) => {

};
