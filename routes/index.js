'use strict'

const express = require('express');
const api = express.Router();
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/user');
const agentCtrl = require('../controllers/agent');
const User = require('../models/user');
const axios = require('axios');
const fileUpload = require('express-fileupload')


api.use(fileUpload())

// Rutas API
api.get('/user/:user', (req, res) => {
    let user_id = req.params.user;

    User.findById(user_id, (err, user) => {

        if (err) res.status(500).send({message: `Error de petición: ${err}`})
        if (!user) res.status(404).send({message: `No existe el usuario`})

        res.status(200).render('mapa', {
            "mensaje": `Hola ${req.params.name}`
        });
    });
});

api.get('/login', (req, res) => {
    res.status(200).render('login')
});

api.get('/calibration/agent/:agent_id', (req, res) => {
    res.status(200).render('agent')
});

api.post('/upload',(req,res) => {
    let EDFiles = req.files
    for(var key in EDFiles) {
        EDFiles[key].mv(`./files/${EDFiles[key].name}`,err => {
            if(err) return res.status(500).send({ message : err })
            return res.status(200).send({ message : 'File upload' })
        })
    }
})

api.get('/download/:file',(req,res) => {
    let file = req.params.file
    res.download("./files/"+file)
})

api.post('/registro', userCtrl.registro)
api.post('/login', userCtrl.login)

api.get('/', (req, res) => {
    res.status(200).render('testbed')
});

api.get('/city', (req, res) => {
    res.status(200).render('city')
});

api.get('/private', auth, function(req, res){
    res.status(200).send({message: "tienes acceso!"})
});


api.get('/testbed', (req, res) => {
    res.status(200).render("testbed")
});

api.get('/dashboard', (req, res) => {
    res.status(200).render("dashboard")
});


api.post('/agent_active', agentCtrl.agent_active);

api.get('/agente/info/:agente_id', agentCtrl.info);

api.get('/calibration', (req, res) => {
    res.status(200).render("calibration")
});

api.get('/services', (req, res) => {
    res.status(200).render("admin_services")
});

api.get('/services/add_service', (req, res) => {
    res.status(200).render("add_service")
});



module.exports = api;
