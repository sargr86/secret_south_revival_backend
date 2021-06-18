const nodemailer = require('nodemailer');
const twoFactor = require("node-2fa");

const db = require('../models');
const Users = db.users;
const AccountVerifications = db.account_verifications;


exports.sendVerificationCode = async (req, res) => {

    let {email} = req.body;

    let transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SERVICE,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    let randomCode = Math.floor(1000 + Math.random() * 9000);

    const newSecret = twoFactor.generateSecret({name: "My Awesome App", account: email});
    const t = twoFactor.generateToken(newSecret.secret);

    let found = await AccountVerifications.findOne({where: {email: email}});

    if (found) {
        let d = {secret: newSecret.secret}
        await AccountVerifications.update(d, {where: {email: email}});
    } else {
        await AccountVerifications.create({email: email, secret: newSecret.secret});
    }


    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Secret South " <foo@example.com>',
        to: email,
        subject: 'Verification code',
        text: 'Verification code',
        html: `${t.token}`
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).json({msg: error.toString()})
        } else if (info) {

            console.log('Message sent: %s', info.messageId);
            res.json(t.token);
        }


    });
    res.json();
};

exports.verifyCode = async (req, res) => {
    const {token, email} = req.body;

    let s = await AccountVerifications.findOne({where: {email}});
    let t = twoFactor.verifyToken(s.secret, token);
    let verified = t?.delta === 0;
    if (verified) {
        res.send(verified);
    } else {
        res.status(500).json({msg: 'The code verification failed'});
    }
};

exports.register = async (req, res) => {

};


exports.login = async (req, res) => {

};
