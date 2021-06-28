require('dotenv').config();

const express = require('express');
const app = express();
const compression = require('compression');
const port = process.env.PORT || 3000;
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cs = require('./config/constants');
const postMaxSize = 50;

console.log(`Your port is ${port}`);

server.listen(port);

// Compress all HTTP responses
app.use(compression());

//Body parser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: postMaxSize + 'mb'}));

// Cors
app.use(cors(require('./config/cors')));


// Non-auth routes
app.use('/auth', require('./routes/auth'));

// Auth Routes

let dist = path.join(__dirname, 'dist/');

// Static resources
app.use(express.static(dist));
app.use('/uploads/', express.static(cs.UPLOADS_FOLDER));

// Separating Angular routes
app.get('*', (req, res, next) => {
    if (!req.url.includes('phpmyadmin')) {
        res.sendFile(dist + 'index.html');
    } else {
        res.status(404).send('Not found');
    }
});

// Passport.js config
const passport = require('passport');
require('./config/google-passport-strategy')(passport);
require('./config/facebook-passport-strategy')(passport);
app.use(passport.initialize({}));
