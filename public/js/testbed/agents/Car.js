
function Car(id, type, info){

    this.id = id;
    this.type = type;
    this.x = 0;
    this.y = 0;
    this.width = 32;
    this.height = 20;

    this.s = 5;
    this.l = 30;    //Longitud coche por defecto
    this.d = "e";   //Direccion por defecto
    this.dd = false;
    this.drive = false;
    this.color = "#F52600"; //Default color

    this.logger = true;


    this.repositionCar = function(tag_id, drive = false){

        let tag = testbed.tags.find(findTag, tag_id);

        this.x = tag.x;
        this.y = tag.y;
        this.d = tag.d;
        this.drive = drive;

        if($("#modalAgent > div#"+this.id).length){
            $(".agent_x").html(this.x);
            $(".agent_y").html(this.y);

            loadLogs(this, "status", "Nueva posición "+tag_id+" ("+this.x+", "+this.y+")");
        }

        console.log("Posicion (" + tag.x + ")," + tag.y+ " de agente "+this.type +" #"+this.id+". TAG: "+tag_id+" dirección:"+tag.d);
    }


    this.isClicked = function(){

        if (this.d == "w") {
            if (y > (this.y - this.height) && y < this.y &&
                x > (this.x - this.width) && x < this.x) {
                clicked = true;
                this.loadContentModal();
            }
        } else if (this.d == "s") {
            if (y > this.y && y < (this.y + this.width) &&
                x > (this.x - this.height) && x < this.x) {
                clicked = true;
                this.loadContentModal();
            }

        } else if (this.d == "n"){
            if (y > (this.y - this.width) && y < this.y &&
                x > this.x && x < (this.x + this.height)) {
                clicked = true;
                this.loadContentModal();
            }
        } else {    //d = e
            if (y > this.y && y < this.y + this.height && x > this.x && x < this.x + this.width) {
                clicked = true;
                this.loadContentModal();
            }
        }
    }


    this.loadContentModal = function() {

        $("#modalAgent > div").attr("id",this.id); //asignamos id en modal para identificar elemento y actualziar estado en tiempo real
        $(".agent_id").html(this.id);
        $(".agent_type").html(this.type);
        $(".agent_x").html(this.x);
        $(".agent_y").html(this.y);
        $('#modalAgent').modal('show')
    }



    this.draw = function(){
        testbed.ctx.fillStyle = info.color ? info.color : this.color;
        //testbed.ctx.drawImage(ambulance, -(ambulance.width / 2), -(ambulance.height / 2));

        if(this.type == "ambulance") {

            this.width = 32;
            this.height = 20;

            if(this.d == "e") {
                x = this.x;
                y = this.y;
            }else{
                //Cambiamos punto origen canvas para rotar elementos a partir de si mismos
                testbed.ctx.translate(this.x, this.y);
                x = y =0;
            }

            if(this.d == "w") {
                testbed.ctx.rotate(180*Math.PI/180);
            }else if(this.d == "s") {
                testbed.ctx.rotate(90*Math.PI/180);
            }else if(this.d == "n"){
                testbed.ctx.rotate(-90*Math.PI/180);
            }

            // Rectangulo vehiculo
            testbed.ctx.rounded_rect(x, y, this.width, this.height); //x, y, width, height
            testbed.ctx.fillStyle = "#99B3CE";
            // Luna delantera
            testbed.ctx.fillRect(x + 22, y, 5, 20);
            testbed.ctx.fillStyle = "#cccccc";
            //Retrovisor izquierdo
            testbed.ctx.fillRect(x + 17, y - 2, 2, 2);
            //Retrovisor derecho
            testbed.ctx.fillRect(x + 17, y + 20, 2, 2);
            //Cruz
            testbed.ctx.fillStyle = "#FF0000";
            testbed.ctx.fillRect(x + 8, y + 2, 3, 15);
            testbed.ctx.fillRect(x + 2, y + 8, 15, 3);

            //Clear translate
            testbed.ctx.setTransform(1, 0, 0, 1, 0, 0);


        }else if(this.type == "garbagetruck") {

             this.width = 50;
            this.height = 26;

            if(this.d == "e") {
                x = this.x;
                y = this.y;
            }else{
                //Cambiamos punto origen canvas para rotar elementos a partir de si mismos
                testbed.ctx.translate(this.x, this.y);
                x = y =0;
            }

            if(this.d == "w") {
                testbed.ctx.rotate(180*Math.PI/180);
            }else if(this.d == "s") {
                testbed.ctx.rotate(90*Math.PI/180);
            }else if(this.d == "n"){
                testbed.ctx.rotate(-90*Math.PI/180);
            }

            testbed.ctx.fillStyle = "#2E5421";
            testbed.ctx.fillRect(x, y, this.width, this.height); //x, y, width, height
            testbed.ctx.fillRect(x +51, y +3, 20, 20); //x, y, width, height
            testbed.ctx.fillStyle = "#99B3CE";

            // Luna delantera
            testbed.ctx.fillRect(x +62, y +3, 5, 20);
            testbed.ctx.fillStyle = "#FF0000";
            //Retrovisor izquierdo
            testbed.ctx.fillRect(x +58, y , 2, 3);
            //Retrovisor derecho
            testbed.ctx.fillRect(x +58, y + 23, 2, 3);

            //Clear translate
            testbed.ctx.setTransform(1, 0, 0, 1, 0, 0);


       }else if(this.type == "firefighters"){

            this.width = 50;
            this.height = 26;

            if(this.d == "e") {
                x = this.x;
                y = this.y;
            }else{
                //Cambiamos punto origen canvas para rotar elementos a partir de si mismos
                testbed.ctx.translate(this.x, this.y);
                x = y =0;
            }

            if(this.d == "w") {
                testbed.ctx.rotate(180*Math.PI/180);
            }else if(this.d == "s") {
                testbed.ctx.rotate(90*Math.PI/180);
            }else if(this.d == "n"){
                testbed.ctx.rotate(-90*Math.PI/180);
            }

            testbed.ctx.fillStyle = "#FF0000";
            testbed.ctx.fillRect(x, y, this.width, this.height); //x, y, width, height
            testbed.ctx.fillRect(x +51, y +3, 20, 20); //x, y, width, height
            testbed.ctx.fillStyle = "#99B3CE";

            //Escalera
            testbed.ctx.fillRect(x, y +9, 50, 1);
            testbed.ctx.fillRect(x, y +15, 50, 1);
            testbed.ctx.fillRect(x, y +9, 1, 6);
            testbed.ctx.fillRect(x +5, y +9, 1, 6);
            testbed.ctx.fillRect(x +10, y +9, 1, 6);
            testbed.ctx.fillRect(x +15, y +9, 1, 6);
            testbed.ctx.fillRect(x +20, y +9, 1, 6);
            testbed.ctx.fillRect(x +25, y +9, 1, 6);
            testbed.ctx.fillRect(x +30, y +9, 1, 6);
            testbed.ctx.fillRect(x +35, y +9, 1, 6);
            testbed.ctx.fillRect(x +40, y +9, 1, 6);
            testbed.ctx.fillRect(x +45, y +9, 1, 6);

            // Luna delantera
            testbed.ctx.fillRect(x +62, y +3, 5, 20);
            testbed.ctx.fillStyle = "#FF0000";
            //Retrovisor izquierdo
            testbed.ctx.fillRect(x +58, y , 2, 3);
            //Retrovisor derecho
            testbed.ctx.fillRect(x +58, y + 23, 2, 3);

            //Clear translate
            testbed.ctx.setTransform(1, 0, 0, 1, 0, 0);

        }else{

            if(this.d == "w"){
                this.w = 25;
                testbed.ctx.rounded_rect(this.x, this.y, this.l, 12);
                testbed.ctx.fillStyle="#99B3CE";
                testbed.ctx.fillRect(this.x + 5, this.y, 5, 12);
                testbed.ctx.fillRect(this.x + 18, this.y, 2, 12);
                testbed.ctx.fillStyle = this.color;
                testbed.ctx.fillRect(this.x + 6, this.y - 2, 2 ,2);
                testbed.ctx.fillRect(this.x + 6, this.y + 12, 2 ,2);
            }
            else if(this.d == "e"){
                this.w = 25;
                testbed.ctx.rounded_rect(this.x, this.y, this.l, 12);
                testbed.ctx.fillStyle="#99B3CE";
                testbed.ctx.fillRect(this.x + 15, this.y, 5, 12);
                testbed.ctx.fillRect(this.x + 4, this.y, 2, 12);
                testbed.ctx.fillStyle = this.color;
                testbed.ctx.fillRect(this.x + 14, this.y - 2, 2 ,2);
                testbed.ctx.fillRect(this.x + 14, this.y + 12, 2 ,2);
            }
            else if(this.d == "s"){
                this.w = 12;
                testbed.ctx.rotate(Math.PI/2);
                testbed.ctx.rounded_rect(this.y, -this.x, this.l, 12);
                testbed.ctx.fillStyle="#99B3CE";
                testbed.ctx.fillRect(this.y + 15, -this.x, 5, 12);
                testbed.ctx.fillRect(this.y + 4, -this.x, 2, 12);
                testbed.ctx.fillStyle = this.color;
                testbed.ctx.fillRect(this.y + 14, -this.x - 2, 2 ,2);
                testbed.ctx.fillRect(this.y + 14, -this.x + 12, 2 ,2);
                testbed.ctx.rotate(-Math.PI/2);

            }
            else{
                this.w = 12;
                testbed.ctx.rotate(Math.PI/2);
                testbed.ctx.rounded_rect(this.y, -this.x, this.l, 12);
                testbed.ctx.fillStyle="#99B3CE";
                testbed.ctx.fillRect(this.y + 5, -this.x, 5, 12);
                testbed.ctx.fillRect(this.y + 18, -this.x, 2, 12);
                testbed.ctx.fillStyle = this.color;
                testbed.ctx.fillRect(this.y + 6, -this.x - 2, 2 ,2);
                testbed.ctx.fillRect(this.y + 6, -this.x + 12, 2 ,2);
                testbed.ctx.rotate(-Math.PI/2);
            }
        }
    }
}