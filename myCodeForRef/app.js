const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

const propertyRoute = require('./api/routes/property');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'real_estate'
});

con.connect(err => {
    if(err)
        throw err;
    console.log("Connected");
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/agent', express.static('./public/agent/'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/property', propertyRoute(con));

module.exports = app;

