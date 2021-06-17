require('dotenv').config();

const express = require('express');
const app = express();
const compression = require('compression');
const port = process.env.PORT || 3000;

console.log(`Your port is ${port}`);

// Compress all HTTP responses
app.use(compression());
