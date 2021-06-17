const nodemailer = require('nodemailer');

exports.sendVerificationCode = async (req, res) => {

    let data = req.body;

    let transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SERVICE,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    let randomCode = Math.floor(1000 + Math.random() * 9000);

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Secret South " <foo@example.com>',
        to: data.email,
        subject: 'Verification code',
        text: 'Verification code',
        html: `${randomCode}`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).json({msg: error.toString()})
        } else if (info) {

            console.log('Message sent: %s', info.messageId);
            res.json(randomCode);
        }


    });
};

exports.register = async (req, res) => {

};


exports.login = async (req, res) => {

};
