'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Inicialización app
const app = express();
const api = require('./routes');    //Inicialización de las rutas de la api
const server = require('http').Server(app);
const io = require('socket.io')(server);


// Carga del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(api);   // Rutas



module.exports = {
    app,
    server,
    io
};