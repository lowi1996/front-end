

function Agente(agente){

    this.agente = this.recognition(agente);
}

Agente.prototype.recognition = function(agente) {

    if (agente.type == "car" || agente.type.slice(agente.type.length-3, agente.type.length) == "car" || agente.type == "ambulance" || agente.type == "firefighters"){
        let car = new Car(agente.id, agente.type, agente.info);
        testbed.cars.push(car);
        car.repositionCar(agente.position, false);
        return car;

    }else if(agente.type == "trafficlight"){
        let sem = new Trafficlight(agente.id, agente.x, agente.y, agente.direction, agente.orientation, agente.attributtes, agente.long);
        testbed.trafficlights.push(sem);
        return sem;

    }else if(agente.type == "streetlight"){
        let streetlight = new Streetlight(agente.id, agente.x, agente.y);
        testbed.streetlights.push(streetlight);
        return streetlight;

    }else if(agente.type == "barrier"){
        let barrier = new Barrier(agente.id, agente.x, agente.y, agente.position);
        testbed.barriers.push(barrier);
        return barrier;
    }else if(agente.type == "bridge"){
        //Codigo provisional y calido solo si hay un puente
        return testbed.bridges[0];
    }
};

Agente.prototype.getAgente = function(){
    return this.agente;
};