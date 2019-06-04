'use strict';

const config = require('../config/testbed');

function agentRecognition(type){

     for (let i = 0; i < config.agent_types.length; i++){
         if(type.toUpperCase() == config.agent_types[i].toUpperCase())
             return true;
     }
     return false;
}



module.exports = {
    agentRecognition
};