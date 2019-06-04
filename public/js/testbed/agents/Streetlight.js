
function Streetlight(id, x, y) {

    this.id = id;
    this.x = x;
    this.y = y;
    this.type = "Farola";

    this.width = 8;
    this.height = 8;
    this.status = 0;
    this.color = ["#FFFFFF", "#FFFF99", "#FFFF00"];

    this.logger = true;
}


Streetlight.prototype.changeStatus = function(status){

    this.status = status;

    if($("#modalAgent > div#"+this.id).length){
        $(".agent_status").html("intensidad "+this.friendlyStatus()+ " ("+this.status+")");

        loadLogs(this, "status", "Cambiada la intensidad a "+this.friendlyStatus());
    }
};


Streetlight.prototype.isClicked = function(){

    if (testbed.y > this.y && testbed.y < this.y + this.height && testbed.x > this.x && testbed.x < this.x + this.width) {
        clicked = true;
        //Muestra por pantalla el modal
        this.loadContentModal();
    }
};


Streetlight.prototype.draw = function() {

    testbed.ctx.save();
    testbed.ctx.fillStyle = this.color[this.status];
    if(this.status != 0) {
        testbed.ctx.shadowColor = this.color[this.status];
        testbed.ctx.shadowBlur = 10;
    }
    testbed.ctx.rounded_rect(this.x, this.y, this.width, this.height);
    testbed.ctx.fill();
    testbed.ctx.restore();
};


Streetlight.prototype.loadContentModal = function() {

    loadContentModal(this);
    this.extraLoadContentModal()
    $('#modalAgent').modal('show')
};


Streetlight.prototype.extraLoadContentModal = function() {

    $(".agent_status").html("intensidad "+this.friendlyStatus()+ " ("+this.status+")");
    $(".agent_change_status").html(
        '<p>Cambiar estado del dispositivo:</p>\
         <select name="status" id="status" placeholder="Escoge un estado" class="js-example-basic-single col-sm-12">\
              <option value="0">Intensidad 0%</option>\
              <option value="1">Intensidad 50%</option>\
              <option value="2">Intensidad 100%</option>\
         </select>'
    );
    $(".js-example-basic-single").select2();
};


Streetlight.prototype.friendlyStatus = function() {

    if (this.status == 0)
        return "0%";
    else if (this.status == 1)
        return "50%";
    else
        return "100%";
}