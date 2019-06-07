'use strict'

const app = require('./app');
//const mongoose = require('mongoose');
const config = require('./config/server');
const functions = require('./helpers/functions');
require('./public/js/helpers/helpers');

const { exec } = require('child_process');
exec('hug -p 8080 -f ./config/API_node.py', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

//Los agentes del lado del servidor
global.agentes = [];

let open_sockets = {};

//Servidor web principal
app.server.listen(config.port, () => {
    console.log(`Conectado servidor. Escuchando en el puerto ${config.port}`);
});


app.io.on("connection", function(socket){

    let socket_id = socket.id
    console.log("Conexion "+socket_id);

    open_sockets[socket_id] = []

    socket.on('agent/recognition', function(data, fn){
        if(functions.agentRecognition(data.type)){
            socket.agent_id = data.id;
            console.info("Reconocimiento agente "+data.type+" #"+data.id+" satisfactorio.");
            socket.broadcast.emit("agent/recognition", data)
            agentes.push(data);
            open_sockets[socket_id].push(data.id)

            fn("ok");
        }else{
            fn("ko");
        }
    });

    socket.on("agent/status", function(data, fn){
        console.log("Recibido estado de agente: "+data.agent_id+ " "+data.status);
        fn(data.agent_id, data.status);
        socket.broadcast.emit("agent/status", data)
    });

    socket.on("agent/position", function(data, fn){
        console.log("Recibida posición de agente: "+data.agent_id+ " "+data.position);
        fn(data.agent_id, data.position);
        socket.broadcast.emit("agent/position", data)
    });

    socket.on("agent/attributes", function(data, fn){
        console.log("Recibido cambio de atributo de agente: "+data.agent_id+ " "+data.attributes);
        fn(data.agent_id, data.attributes);
        socket.broadcast.emit("agent/attributes", data)
    });

    socket.on('disconnect', function () {

        for(let index_sockets in open_sockets[socket_id]){
            console.warn("Desconexion agente "+open_sockets[socket_id][index_sockets])
            socket.broadcast.emit("agent/disconnect", open_sockets[socket_id][index_sockets])

            let index_agentes = agentes.findIndex(findAgentes, open_sockets[socket_id][index_sockets]);
            if(index_agentes > -1)
                agentes.splice(index_agentes, 1)
        }
        delete open_sockets[socket_id];
    });


    /**
     * El frontend se ha conectado y pide los dispositivos actuales
     */
    socket.on("front/getData", function(init){

        if(init){
            console.log("Inicializando FrontEnd...");
            console.log("Transfiriendo "+agentes.length+" agentes activos.");

            socket.emit("front/init", agentes.length);

            for(let i = 0; i < agentes.length; i++) {
                socket.emit("agent/recognition", agentes[i]);
            }
        }else{
            console.error("Petición inicialización FrontEnd perdida");
        }
    });

    /**
     * El frontend envía un cambio de estado a un dispositivo agent
     */
    socket.on("front/agent/status", function(data){
        console.log(data)
        socket.broadcast.emit("front/agent/status", data);
    });
});

/*mongoose.connect(config.db, (err, res) => {

    if(err)
        return console.log(`Error al conectar a MongoDB: ${err}`);
    console.log("Conectada la base de datos MongoDb!");
*/

//});


function findAgentes(agente){
    return agente.id === this;
}

