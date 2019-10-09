const express = require('express');
const app = express();

const port = 3000;
const server = require('http').createServer(app);
const cors = require('cors');


// Cors
app.use(cors(require('./config/cors')));

const bodyParser = require('body-parser');

// Start server on pre-defined port
server.listen(port, () => {
    console.log('server is listening on port ' + port)
});

// Dotenv used to read process.env
require('dotenv').config();


// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Passport.js config
const passport = require('passport');
require('./config/googlePassportStrategy')(passport);
require('./config/facebookPassportStrategy')(passport);
app.use(passport.initialize({}));

// Routes
app.use('/auth', require('./routes/auth'));




