
function Trafficlight(id, x, y, direction, orientation, attributes, long = testbed.width/2) {

    this.id = id;
    this.x = x;
    this.y = y;

    this.type = "Semáforo";
    this.attributes = attributes;

    this.long = long; //Longitud "palo" semaforo. La longitud de un carril de una carretera
    this.direction = direction;   //Posicion en la carretera (left/right) siguiendo el sentidode izq. a der.
    this.orientation = orientation; //Orientación de la carretarea (h horizontal, v vertical)

    this.status = "1000";
    this.color = "#00ff00";
    this.colors = {
        green: "#00ff00",
        yellow: "yellow",
        red: "red",
        blue: "blue"
    };
    this.emergency = false;
    this.logger = true;

    //Posicion recuadro clickable. Por defecto posición x,y con offset
    this.x_click = x - 5;
    this.y_click = y;
    //Medidas recuadro clickable. Por defecto 15 x ancho_carretera/2
    this.width = 20;
    this.height = this.long;
}


Trafficlight.prototype.changeStatus = function(status){

    let green = status[0];
    let yellow = status[1];
    let red = status[2];
    let blue = status[3];

    this.emergency = false;

    if(green != "0"){
        this.color = this.colors["green"];
    }

    if(yellow != "0"){
        this.color = this.colors["yellow"];
    }

    if(red != "0"){
        this.color = this.colors["red"];
    }

    if(blue != "0"){
        this.emergency = true;
    }

    this.status = status;

    if($("#modalAgent > div#"+this.id).length){
        $(".agent_status").html(this.friendlyStatus()+" ("+this.status+")");

        loadLogs(this, "status", "Nuevo estado "+this.friendlyStatus());
    }
};


Trafficlight.prototype.changeAttributes = function(attributes){
    this.attributes = attributes;

    if($("#modalAgent > div#"+this.id).length){
        $(".agent_status").html(this.status);

        loadLogs(this, "Change attributtes", "Cambio atributos "+friendlyAttributtes(this.attributes));
    }
};


Trafficlight.prototype.isClicked = function(){

    if(this.orientation == "h") {
        if (this.direction == "right") {
            if (testbed.y > (this.y - this.height) && testbed.y < this.y && testbed.x > (this.x - this.width) && testbed.x < this.x) {
                clicked = true;
                this.loadContentModal();
            }
        }else{
            if (testbed.y > this.y && testbed.y < (this.y + this.height) && testbed.x > this.x && testbed.x < (this.x + this.width)) {
                clicked = true;
                this.loadContentModal();
            }
        }
    }else if(this.orientation == "v") {
            if (this.direction == "right") {
            if (testbed.y > this.y && testbed.y < (this.y + this.width) && testbed.x > (this.x - this.width) && testbed.x < this.x) {
                clicked = true;
                this.loadContentModal();
            }

        }else{
            if (testbed.y > (this.y - this.height) && testbed.y < this.y && testbed.x > this.x && testbed.x < (this.x + this.width)) {
                clicked = true;
                this.loadContentModal();
            }
        }
    }
};


Trafficlight.prototype.loadContentModal = function() {

    loadContentModal(this);
    this.extraLoadContentModal()
    $('#modalAgent').modal('show')
};


Trafficlight.prototype.extraLoadContentModal = function() {

    $(".agent_status").html(this.friendlyStatus()+" ("+this.status+")");
    $(".agent_change_status").html(
        '<p>Cambiar estado del dispositivo:</p>\
         <select name="status" id="status" placeholder="Escoge un estado" class="js-example-basic-single col-sm-12">\
              <option value="1000">Verde (1000)</option>\
              <option value="0100">Ambar (0100)</option>\
              <option value="0010">Rojo (0010)</option>\
              <option value="1002">Emergencia / Verde (1002)</option>\
              <option value="0102">Emergencia / Ambar (0102)</option>\
              <option value="0012">Emergencia / Rojo (0012)</option>\
         </select>'
    );
    $(".js-example-basic-single").select2();
};


Trafficlight.prototype.friendlyStatus = function() {

    let green = this.status[0];
    let yellow = this.status[1];
    let red = this.status[2];
    let friendly_status = "";

    if(this.emergency)
        friendly_status = "Emergencia | ";

    if (green != "0")
        friendly_status += "Verde";

    if (yellow != "0")
        friendly_status += "Amarillo";

    if (red != "0")
        friendly_status += "Rojo";

    return friendly_status;
}


Trafficlight.prototype.draw = function() {

    testbed.ctx.save();
    testbed.ctx.beginPath();
    testbed.ctx.setLineDash([]);
    testbed.ctx.strokeStyle = '#ffffff';

    //Color semaforo
    testbed.ctx.fillStyle = this.color;
    testbed.ctx.shadowColor = this.color;

    testbed.ctx.moveTo(this.x, this.y); //Punto inicial

    //testbed.ctx.fillRect(this.x, this.y, this.width, this.height); //para pintar recuadro clickable

    if(this.orientation == "h") {
        if (this.direction == "right") {

            testbed.ctx.lineTo(this.x, this.y - this.long); //Punto final
            testbed.ctx.stroke();

            testbed.ctx.shadowBlur = 5;
            testbed.ctx.rounded_rect(this.x - 7, this.y - (this.long/3) - 3, this.long > 35 ? 7 : 5, this.long > 35 ? 7 : 5);
            testbed.ctx.fill();

            if(this.emergency){
                testbed.ctx.fillStyle = this.colors["blue"];
                testbed.ctx.shadowColor = this.colors["blue"];
            }
            testbed.ctx.rounded_rect(this.x - 7, this.y - ((this.long / 3) * 2) - 3, this.long > 35 ? 7 : 5, this.long > 35 ? 7 : 5);
            testbed.ctx.fill();

        } else {

            testbed.ctx.lineTo(this.x, this.y + this.long); //Punto final
            testbed.ctx.stroke();  //Traza linea de punto inicial a final

            testbed.ctx.shadowBlur = 5;
            testbed.ctx.rounded_rect(this.x + 1, this.y + (this.long/3) - 3, this.long > 35 ? 7 : 5, this.long > 35 ? 7 : 5);
            testbed.ctx.fill();

            if(this.emergency){
                testbed.ctx.fillStyle = this.colors["blue"];
                testbed.ctx.shadowColor = this.colors["blue"];
            }

            testbed.ctx.rounded_rect(this.x + 1, this.y + ((this.long / 3) * 2) - 3, this.long > 35 ? 7 : 5,  this.long > 35 ? 7 : 5);
            testbed.ctx.fill();
        }

    }else if(this.orientation == "v") {

        //Configuración para ajustar recuadro clickable
        this.width = this.long;
        this.height = 20;

        if (this.direction == "right") {

            testbed.ctx.lineTo(this.x - this.long, this.y); //Punto final
            testbed.ctx.stroke();  //Traza linea de punto inicial a final

            testbed.ctx.shadowBlur = 5;
            testbed.ctx.rounded_rect(this.x - (this.long/3) - 3, this.y, this.long > 35 ? 7 : 5, this.long > 35 ? 7 : 5);
            testbed.ctx.fill();

            if(this.emergency){
                testbed.ctx.fillStyle = this.colors["blue"];
                testbed.ctx.shadowColor = this.colors["blue"];
            }

            testbed.ctx.rounded_rect(this.x - ((this.long / 3) * 2) - 3, this.y, this.long > 35 ? 7 : 5, this.long > 35 ? 7 : 5);
            testbed.ctx.fill();

        } else {

            testbed.ctx.lineTo(this.x + this.long, this.y); //Punto final
            testbed.ctx.stroke();  //Traza linea de punto inicial a final

            testbed.ctx.shadowBlur = 5;
            testbed.ctx.rounded_rect(this.x + (this.long/3) - 3, this.y - 7, this.long > 35 ? 7 : 5, this.long > 35 ? 7 : 5);
            testbed.ctx.fill();

            if(this.emergency){
                testbed.ctx.fillStyle = this.colors["blue"];
                testbed.ctx.shadowColor = this.colors["blue"];
            }

            testbed.ctx.rounded_rect(this.x + ((this.long / 3) * 2) - 3, this.y - 7, this.long > 35 ? 7 : 5, this.long > 35 ? 7 : 5);
            testbed.ctx.fill();
        }
    }

    testbed.ctx.restore();
}
