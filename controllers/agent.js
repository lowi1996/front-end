'use strict';

/** AGENT CONTROLLER **/



function agent_active(req, res){

    let index = agentes.findIndex(findAgentes, req.body.id);
    if(index > -1)
        return res.status(200).send(true)
    else
        return res.status(200).send(false)
}


function findAgentes(agente){
    return agente.id === this;
}


function info(req, res){

    let agente = agentes.find(findAgentes, req.params.agente_id.toUpperCase());

    if( typeof agente !== 'undefined')
        return res.status(200).render('agentes/info', {
            "agente" : agente
        });
    else return res.status(404).render('errors/404')

}

module.exports = {
    agent_active,
    info
};