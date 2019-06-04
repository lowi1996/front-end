'use strict';

const User = require('../models/user');
const service = require('../services');

function registro(req, res){

    let user = new User({
        email: req.body.email,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        password: req.body.password
    });

    user.save((err, userStored) => {
        if(err)
            return res.status(500).send({'message': `Error al crear el usuario: ${err}`});

        return res.status(201).send({
            token: service.createToken(user),
            user: userStored
        });
    })
}

function login(req, res){

    //res.render("login");
    if(req.body.email == "admin@frontend.com" && req.body.password == "admin"){
        return res.status(200).render("mapa");
    }
    return res.status(200).render("login",{
        message : "Credenciales incorrectas!"
    });

    /*User.findOne({email: req.body.email}, (err, user) => {
        if(err) return res.status(500).send({message: err})
        if(!user) return res.status(404).send({message: "No existe el usuario"})

        //Usuario correctamente logueado
        req.user = user
        return res.status(200).render("mapa")

        send({
            message: "Te has logueado",
            user: user,
            token: service.createToken(user)
        })
    });*/
}

module.exports = {
    registro,
    login
};