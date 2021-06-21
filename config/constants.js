const path = require('path');

const generateHbsSettings = require('../helpers/generateHbsSettings');

module.exports = {
    UPLOADS_FOLDER: path.join(__dirname, '../public/uploads'),
    EMAIL_HBS_SETTINGS: generateHbsSettings('verification'),
    NODEMAILER_TRANSPORT_SETTINGS: {
        service: process.env.NODEMAILER_SERVICE,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    }
};


