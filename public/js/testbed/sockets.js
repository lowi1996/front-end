'use strict'

const socket = io.connect('http://'+config.host+':'+config.port, {'forceNew' : true});

/* Cliente sockets.io*/

/* Cuando se connecta el panel front-end al servidor */
socket.on("connect", function(){

    console.log("Inicializando FrontEnd...");
    socket.emit("front/getData", true);
    //Deberia enviar al servidor los agentes que se han creado estaticamente desde codigo en el.
});


socket.on("front/init", (n_agents) => {

    console.log("Agentes activos: "+n_agents);
});


socket.on("agent/recognition", (data_agente) => {

    if(data_agente.positioning == "rfid") {
        let agente = testbed.agents.find(findAgente, data_agente.id);
        if (!agente) {
            agente = new Agente(data_agente);
            agente = agente.getAgente();
            testbed.agents.push(agente);
        }
        console.info("Conectado agente "+data_agente.type+" #"+data_agente.id)
    }
});


socket.on('agent/status', (data) => {

    let agent = testbed.agents.find(findAgente, data.agent_id);
    agent.changeStatus(data.status);

});


socket.on('agent/attributes', (data) => {

    let agent = testbed.agents.find(findAgente, data.agent_id);
    agent.changeAttributes(data.attributes);
});


socket.on('agent/position', (data) => {

    let car = testbed.cars.find(findAgente, data.agent_id);
    car.repositionCar(data.position);
});


socket.on('agent/disconnect', (agente_id) => {

    let agente = testbed.agents.find(findAgente, agente_id);

    //Eliminamos el agente desconectado del array de agentes correspondiente
    if (agente instanceof Car) {
        testbed.cars.splice(testbed.cars.findIndex(findAgente, agente_id), 1);

    } else if (agente instanceof Trafficlight) {
        testbed.trafficlights.splice(testbed.trafficlights.findIndex(findAgente, agente_id), 1);

    } else if (agente instanceof Streetlight) {
        testbed.streetlights.splice(testbed.streetlights.findIndex(findAgente, agente_id), 1);

    } else if (agente instanceof Barrier) {
        testbed.barriers.splice(testbed.barriers.findIndex(findAgente, agente_id), 1);
    }

    //Eliminamos el agente del array de agents
    let index = testbed.agents.findIndex(findAgente, agente_id);
    if (index > -1)
        testbed.agents.splice(index, 1);

    console.warn("Desconexion agente " + agente.type + " #" + agente_id)
});


function findAgente(agente){
    return agente.id === this;
}

function findTag(tag){
    return tag.id === this;
}