

function Building(id, building, x, y){

    this.id = id;
    this.building = building;
    [this.width, this.height] = this.characteristics().measurements;
    this.x = x;
    this.y = y;
    this.status = "Desactivado"
}


Building.prototype.isClicked = function(){

    if (testbed.y > this.y && testbed.y < this.y + this.height && testbed.x > this.x && testbed.x < this.x + this.width) {
        clicked = true;
        this.loadContentModal()
    }
};


Building.prototype.characteristics = function(){

    if(this.building == "neapolis"){
        return {measurements : [240,120]};

    }else if(this.building == "bomberos"){
        return {measurements : [130,180]};

    }else if(this.building == "hospital"){
        return {measurements : [240,100]};
    }
}


Building.prototype.loadContentModal = function() {

    loadContentModal(this);
    this.extraLoadContentModal()
    //Mostramos modal
    $('#modalAgent').modal('show')

}

Building.prototype.extraLoadContentModal = function() {

    $(".agent_type").html(this.building);
};


Building.prototype.draw = function() {

    testbed.ctx.setLineDash([]);
    testbed.ctx.fillStyle = "#504f4d";
    testbed.ctx.rounded_rect(this.x, this.y, this.width, this.height);

    if(this.building == "neapolis"){

        testbed.ctx.beginPath();
        testbed.ctx.moveTo(this.x + 90, this.y + 35);
        testbed.ctx.lineTo(this.x + 210, this.y + 20);
        testbed.ctx.lineTo(this.x + 210, this.y + 100);
        testbed.ctx.lineTo(this.x + 90, this.y + 85);
        testbed.ctx.lineTo(this.x + 90, this.y + 35);
        testbed.ctx.fillStyle = "#e8fbf9";
        testbed.ctx.fill();
        testbed.ctx.closePath();
        testbed.ctx.strokeStyle = "#e8fbf9";
        testbed.ctx.stroke();

        testbed.ctx.beginPath();
        testbed.ctx.lineWidth = 1;
        testbed.ctx.arc(this.x + 60, this.y + 60, 40, 0 * Math.PI, 2 * Math.PI);
        testbed.ctx.fillStyle = "#4d5d6a";
        testbed.ctx.fill();
        testbed.ctx.strokeStyle = "#4d5d6a";
        testbed.ctx.stroke();

        testbed.ctx.beginPath();
        testbed.ctx.moveTo(this.x + 30, this.y + 35);
        testbed.ctx.lineTo(this.x + 90, this.y + 45);
        testbed.ctx.lineTo(this.x + 180, this.y + 35);
        testbed.ctx.lineTo(this.x + 180, this.y + 85);
        testbed.ctx.lineTo(this.x + 90, this.y + 75);
        testbed.ctx.lineTo(this.x + 30, this.y + 85);
        testbed.ctx.lineTo(this.x + 30, this.y + 35);
        testbed.ctx.fillStyle = "#6f6a67";
        testbed.ctx.fill();
        testbed.ctx.closePath();
        testbed.ctx.strokeStyle = "#6f6a67";


    }else if(this.building == "bomberos"){

        testbed.ctx.fillStyle = "#bf241f";
        testbed.ctx.rounded_rect(this.x - 10, this.y + 100, 35, 40); //Puerta abierta

        testbed.ctx.fillStyle = "#b4824d";
        testbed.ctx.rounded_rect(this.x + 30, this.y + 10, 80, 60); //Edificio de bomberos pequeño
        testbed.ctx.rounded_rect(this.x + 20, this.y + 80, 100, 80); //Edificio de bomberos grande

        // Techo (cuadricula)
        testbed.ctx.fillStyle = "#bf241f";
        for (let i = 0; i < 90; i+=10)
            testbed.ctx.rounded_rect(this.x + 30 + i, this.y + 5, 2, 163);

        for (let i = 0; i < 165; i+=15)
            testbed.ctx.rounded_rect(this.x + 25, this.y + 10 + i, 92, 2);


    }else if(this.building == "hospital"){
        testbed.ctx.fillStyle = "#A09383";
        testbed.ctx.rounded_rect(this.x + 30, this.y + 10, 60, 60);
        testbed.ctx.rounded_rect(this.x + 30 + 50, this.y + 30, 80, 15);
        testbed.ctx.rounded_rect(this.x + 150, this.y + 10, 60, 60);
        //H
        testbed.ctx.fillStyle = "#bf241f";
        testbed.ctx.rounded_rect(this.x + 42, this.y + 25, 10, 30);
        testbed.ctx.rounded_rect(this.x + 42 + 5, this.y + 36, 25, 8);
        testbed.ctx.rounded_rect(this.x + 42 + 10 + 15, this.y + 25, 10, 30);
    }
}