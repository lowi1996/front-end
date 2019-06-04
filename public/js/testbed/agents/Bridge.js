
function Bridge(id, x, y, width, height, status = "closed") {

    this.id = id;
    this.x = x;
    this.y = y;
    this.type = "Puente levadizo";
    this.width = width;
    this.height = height;
    this.status = status;
    this.color = "#605A4C";
    this.logger = true;
}

Bridge.prototype.changeStatus = function(status){
    this.status = status;

    if($("#modalAgent > div#"+this.id).length){
        $(".agent_status").html(this.status);

        loadLogs(this, "status", "Nuevo estado "+this.status);
    }
};

Bridge.prototype.isClicked = function(){

    if (testbed.y > this.y && testbed.y < this.y + this.height && testbed.x > this.x && testbed.x < this.x + this.width) {
        clicked = true;
        this.loadContentModal();
    }
};


Bridge.prototype.loadContentModal = function() {

    loadContentModal(this);
    $('#modalAgent').modal('show')
};


Bridge.prototype.draw = function(){

    testbed.ctx.fillStyle = this.color;
    if(this.status == "closed"){

        testbed.ctx.fillRect(this.x, this.y, this.width, this.height);  //Asfalto

        testbed.ctx.fillStyle = "#A68B44";
        testbed.ctx.fillRect(this.x, this.y + ((this.height / 2) - 1), this.width, 2);  //Linia divisoria carretera

        // Bordes carretera
        testbed.ctx.fillStyle = "#6495ED";
        // Borde de arriba
        testbed.ctx.rounded_rect(this.x - 5, this.y - 5, this.width + (2 * 5), 5);
        // Borde de abajo
        testbed.ctx.rounded_rect(this.x - 5, this.y + this.height, this.width + (2 * 5), 5);

    }else{
        var offset_x = 5;
        testbed.ctx.fillRect(this.x, this.y, 482 - testbed.margin, this.height);  //Asfalto 1
        testbed.ctx.fillRect(this.x + (482 - testbed.margin), this.y - 15, 120, this.height);  //Asfalto 2 (puente levadizo)
        testbed.ctx.fillRect(this.x + (482 - testbed.margin) + 120, this.y, this.width + (2 * offset_x) - 120 - (482 - testbed.margin + offset_x), this.height);  //Asfalto 3

        testbed.ctx.fillStyle = "#A68B44";
        testbed.ctx.fillRect(this.x, this.y + ((this.height / 2) - 1), 482 - testbed.margin, 2);  //Linia divisoria 1
        testbed.ctx.fillRect(this.x + (482 - testbed.margin), this.y + ((this.height / 2) - 1) - 15, 120, 2);  //Linia divisoria 2 (puente levadizo)
        testbed.ctx.fillRect(this.x + (482 - testbed.margin) + 120, this.y + ((this.height / 2) - 1), this.width + (2 * offset_x) - 120 - (482 - testbed.margin + offset_x) - offset_x, 2);  //Linia divisoria 1

        // Bordes carretera
        testbed.ctx.fillStyle = "#42a4cb";

        testbed.ctx.rounded_rect(this.x - offset_x, this.y - offset_x, 482 - testbed.margin + offset_x, offset_x);  // Borde de arriba 1
        testbed.ctx.fillRect(this.x + (482 - testbed.margin), this.y - offset_x - 15, 120, offset_x);  // Borde de arriba 2 (puente levadizo)
        testbed.ctx.rounded_rect(this.x + (482 - testbed.margin) + 120, this.y - offset_x, this.width + (2 * offset_x) - 120 - (482 - testbed.margin + offset_x), offset_x);  // Borde de arriba 3

        testbed.ctx.rounded_rect(this.x - offset_x, this.y + this.height, 482 - testbed.margin + offset_x, offset_x);  // Borde de abajo 1
        testbed.ctx.fillRect(this.x + (482 - testbed.margin), this.y - 15 + this.height, 120, offset_x);    // Borde de abajo 2 (puente levadizo)
        testbed.ctx.rounded_rect(this.x + (482 - testbed.margin) + 120, this.y + this.height, this.width + (2 * offset_x) - 120 - (482 - testbed.margin + offset_x), offset_x);  // Borde de arriba 3
    }

    //Soportes puente
    testbed.ctx.fillStyle = "#404040";
    testbed.ctx.rounded_rect(this.x + (482 - testbed.margin) - 6, this.y-25, 25, 110);
    testbed.ctx.rounded_rect(this.x + (482 - testbed.margin) + 110, this.y-25, 25, 110);
}

