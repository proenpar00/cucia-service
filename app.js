var dotenv = require('dotenv');  // Cargar dotenv
dotenv.config();  // Cargar las variables de entorno desde el archivo .env

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var imageRouter = require('./routes/image');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/image', imageRouter);

//setup connection to mongo
const mongoose = require('mongoose');
const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost/test';
console.log("Conectando a la base de datos: %s", DB_URL)

mongoose.connect(DB_URL);
const db = mongoose.connection;

//recover from errors
db.on('error', console.error.bind(console, 'db connection error'));

module.exports = app;
