
function Barrier(id, x, y, position = "up") {

    this.id = id;
    this.x = x;
    this.y = y;
    this.type = "Barrera";
    this.width = 10;
    this.height = 60;
    this.status = "open";
    this.position = position;
    this.logger = true;
}


Barrier.prototype.changeStatus = function(status){
    this.status = status;

    if($("#modalAgent > div#"+this.id).length){
        $(".agent_status").html(this.status);

        loadLogs(this, "status", "Nuevo estado "+this.friendlyStatus());
    }
};





Barrier.prototype.isClicked = function(){

    if (testbed.y > this.y && testbed.y < this.y + this.height && testbed.x > this.x && testbed.x < this.x + this.width) {
        clicked = true;
        this.loadContentModal();
    }
};


Barrier.prototype.draw = function() {

    testbed.ctx.shadowBlur = 0;
    testbed.ctx.save();
    testbed.ctx.setLineDash([]);

    testbed.ctx.fillStyle = "#FF7F50";
    testbed.ctx.fillRect(this.x, this.y, this.width, 10);
    testbed.ctx.fillStyle = "brown";


    if(this.position == "up") {

        testbed.ctx.fillRect(this.x - 4, this.y + 3, 4, 4);

        if (this.status == "closed") {
            testbed.ctx.beginPath();

            testbed.ctx.moveTo(this.x - 2, this.y + 3);
            testbed.ctx.lineTo(this.x - 2, this.y - this.height + 6); //Punto final
            testbed.ctx.strokeStyle = 'brown';
            testbed.ctx.lineWidth = 3;
            testbed.ctx.stroke();
        }
    }else if(this.position == "down"){

        testbed.ctx.fillRect(this.x + 10, this.y + 3, 4, 4);

        if (this.status == "closed") {

            testbed.ctx.beginPath();
            testbed.ctx.moveTo(this.x + 12, this.y + 6);
            testbed.ctx.lineTo(this.x + 12, this.y + this.height); //Punto final
            testbed.ctx.strokeStyle = 'brown';
            testbed.ctx.lineWidth = 3;
            testbed.ctx.stroke();
        }
    }
    testbed.ctx.restore();
}


Barrier.prototype.loadContentModal = function() {

    loadContentModal(this);
    this.extraLoadContentModal()
    $('#modalAgent').modal('show')
}


Barrier.prototype.extraLoadContentModal = function() {};