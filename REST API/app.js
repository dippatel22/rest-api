const express = require('express');
const studentRout = require('./api/routs/student');
const userRout = require('./api/routs/user');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const fileUpload=require('express-fileupload');

mongoose.connect('your api');

mongoose.connection.on('error', err => {
    console.log('connection fail');
});

mongoose.connection.on('connected', connected => {
    console.log('connection with database');
});

app.use(fileUpload({
    useTempFiles:true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/student', studentRout);
app.use('/user',userRout);

app.use((req, res, next) => {
    res.status(404).json(
        {
            error: 'bad request'

        }
    )
})

module.exports = app;
