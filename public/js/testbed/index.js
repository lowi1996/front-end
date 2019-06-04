
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();


$('#logger').hide();


$('#modalAgent').on('hidden.bs.modal', function (e) {

    $('#modalAgent > div').attr("id", "");
    $('#modalAgent .alerta').show();
    $('#modalAgent #enviar').prop("disabled", true)
    $("span.agent").each(function(){
        $(this).html("");
    });
    $("#modalAgent .agent_change_status").html("");
    $("#more_info").attr("href", "");
    $('.logger_table').html("");
    $('#logger').hide();
});


//Evento enviar cambio de estado a agente
$('#enviar').click(function(){

    let agente_id = $('#modalAgent > div').attr("id");
    let status = $('#modalAgent #status').val();
    console.log(status);
    socket.emit("front/agent/status", {agente_id : agente_id, status : status})
});


count_scroll_events = 0;
document.addEventListener("wheel", function() {
    count_scroll_events++;
    if(count_scroll_events == 20) {
        window.location.href = "/city";
    }
});




if(1/*BrowserDetect.getRun()*/) {

    //Instacia principal y única del TestBed
    var testbed = new Testbed();

    if (!testbed.ctx.setLineDash) {
        testbed.ctx.setLineDash = function () {
            console.error("El navegador no soporta líneas discontinuas");
        }
    }

    init(); //Inicialización elementos estáticos TestBed
    animloop(); //primera llamada al bucle de refresco
}




/**
 * Función que inicializa Testbed y NO esta dentro del bucle de dibujado. Inicializa elementos fijos del testbed
 */
function init(){

    // LECTURA TAGS
    $.getJSON("js/testbed/position_tags.json", function( data ) {
        $.each( data, function(id, val) {
            tag = new Tag(id, val.x ,val.y, val.d);
            testbed.tags.push(tag);
        });
    });

    //CARRETERAS
    //road0
    testbed.roads.push(new Road(testbed.margin, testbed.margin, testbed.w - (testbed.margin * 2), testbed.width));

    //road1
    testbed.roads.push(new Road(testbed.margin, testbed.margin, testbed.width, testbed.h - (testbed.margin * 2)));

    //road2
    testbed.roads.push(new Road(472 + testbed.margin, testbed.margin, testbed.width - 12, testbed.h - (testbed.margin * 2))); // -6 para corregir dimensiones

    //road3
    testbed.roads.push(new Road(954 + testbed.margin, testbed.margin, testbed.width, testbed.h - (testbed.margin * 2)));

    //road4 (puente)
    var bridge = new Bridge("BR1", testbed.margin + testbed.width, 308 + testbed.margin, testbed.w - (testbed.margin * 2) - (testbed.width*2), 60, "closed");
    testbed.bridges.push(bridge);
    testbed.agents.push(bridge);
    testbed.roads.push(new Road(testbed.margin + testbed.width, 308 + testbed.margin, testbed.w - (testbed.margin * 2) - (testbed.width*2), 60, "#605A4C", bridge));

    //road5
    testbed.roads.push(new Road(testbed.margin, testbed.h - testbed.margin - testbed.width, testbed.w - (testbed.margin * 2), testbed.width));


    //EDIFICIOS
    let building = new Building(1, "hospital", 60, 40);
    testbed.buildings.push(building);
    testbed.agents.push(building);

    building = new Building(2, "neapolis", 800, 569)
    testbed.buildings.push(building);
    testbed.agents.push(building);

    building = new Building(3, "bomberos",1212, 50)
    testbed.buildings.push(building);
    testbed.agents.push(building);


    //SEMAFOROS
    /*let trafficlight = new Trafficlight("TS1", 591, 817, "right", "h")
    testbed.trafficlights.push(trafficlight);
    testbed.agents.push(trafficlight);*/

    trafficlight = new Trafficlight("TW2", 261, 447, "left", "h", {}, 60/2)
    testbed.trafficlights.push(trafficlight);
    testbed.agents.push(trafficlight);

    trafficlight = new Trafficlight("TS1", 591, 817, "right", "h", {})
    testbed.trafficlights.push(trafficlight);
    testbed.agents.push(trafficlight);

    /*trafficlight = new Trafficlight("TS2", 606, 678, "left", "v")
    testbed.trafficlights.push(trafficlight);
    testbed.agents.push(trafficlight);*/

    trafficlight = new Trafficlight("TW1", 139, 430, "left", "v", {})
    testbed.trafficlights.push(trafficlight);
    testbed.agents.push(trafficlight);

    trafficlight = new Trafficlight("TN2", 720, 279, "right", "v", {})
    testbed.trafficlights.push(trafficlight);
    testbed.agents.push(trafficlight);

    trafficlight = new Trafficlight("TN3", 592, 259, "right", "h", {})
    testbed.trafficlights.push(trafficlight);
    testbed.agents.push(trafficlight);

    /*trafficlight = new Trafficlight("TS3", 741, 697, "left", "h")
    testbed.trafficlights.push(trafficlight);
    testbed.agents.push(trafficlight);*/


    //FAROLAS
    let streetlight = new Streetlight("F1", 315, 818);
    testbed.streetlights.push(streetlight);
    testbed.agents.push(streetlight);

    streetlight = new Streetlight("F2", 433, 818);
    testbed.streetlights.push(streetlight);
    testbed.agents.push(streetlight);

    streetlight = new Streetlight("F3", 664, 818);
    testbed.streetlights.push(streetlight);
    testbed.agents.push(streetlight);

    streetlight = new Streetlight("F4", 905, 818);
    testbed.streetlights.push(streetlight);
    testbed.agents.push(streetlight);

    streetlight = new Streetlight("F5", 1023, 818);
    testbed.streetlights.push(streetlight);
    testbed.agents.push(streetlight);

    //Barreras
    let barrier = new Barrier("BA1", 500, 508);
    testbed.barriers.push(barrier);
    testbed.agents.push(barrier);
    barrier = new Barrier("BA2", 820, 438, "down");
    testbed.barriers.push(barrier);
    testbed.agents.push(barrier);

    //intersections();
}

function isClicked(elemento){
    if(!testbed.clicked)
        elemento.isClicked();
}

/*
* Pinta el escenario
*/
function drawscene(){

    testbed.intersections_arr = [];

    //Fondo testbed
    testbed.ctx.fillStyle = "#4DBB4C";
    testbed.ctx.fillRect(0, 0, testbed.w, testbed.h);

    for(var i = 0; i < testbed.roads.length; i++){
        testbed.roads[i].draw();
    }

    draw_intersections();

    draw_tags();

    draw_buildings();

    draw_barriers();

    draw_traffic_lights();

    draw_street_lights();

    drive_cars();
}


function draw_tags(){

    testbed.tags.forEach(function(tag) {
        tag.draw();
    });
}

function draw_buildings(){

    testbed.buildings.forEach(function(building) {
        building.draw();
    });
}

function draw_traffic_lights(){

    testbed.trafficlights.forEach(function(trafficlight) {
        trafficlight.draw();
    });
}

function draw_street_lights(){

    testbed.streetlights.forEach(function(streetlight) {
        streetlight.draw();
    });
}

function draw_barriers(){

    testbed.barriers.forEach(function(barrier) {
        barrier.draw();
    });
}

var left_green = false;
//setInterval("left_greenc()",3000);

function left_greenc(){
    left_green = !left_green;
}

function drive_cars(){

    for(var i=0; i < testbed.cars.length; i++){
        var c = testbed.cars[i];

        if(c.drive) {
            if (c.d == "e")
                c.x += 1;
            else if (c.d == "n")
                c.y -= 1;
            else if (c.d == "w")
                c.x -= 1;
            else
                c.y += 1;
        }

        c.draw();
    }
}


Object.getPrototypeOf(testbed.ctx).rounded_rect = function(x,y,w,h,r){

    if (typeof r === "undefined") {
        r = 2;
    }
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    this.fill();
}


function draw_intersections(){

    for(var i=0; i< testbed.roads.length; i++){
        var r1 = testbed.roads[i];
        for(var j=0; j < testbed.roads.length; j++){
            var r2 = testbed.roads[j];


            if(!r1.bridge && !r2.bridge) {

                if (r1.width > r1.height) {
                    if (r2.width < r2.height) {
                        if ((r1.x + r1.width) > r2.x && r1.x <= r2.x) {
                            if ((r2.y + r2.height) >= r1.y && r2.y <= r1.y) {
                                //console.log("intersection found at ("+r1.y+","+r2.x+")");
                                var roadtop = true;
                                var roadbottom = true;
                                var roadleft = true;
                                var roadright = true;
                                if (r1.y == r2.y) {
                                    //no intersection top
                                    var roadtop = false;
                                }
                                if (r1.x == r2.x) {
                                    //no intersection left
                                    var roadleft = false;
                                }
                                if ((r1.x + r1.width) == (r2.x + r2.width)) {
                                    //no intersection right
                                    var roadright = false;
                                }

                                if ((r1.y + r1.height) == (r2.y + r2.height)) {
                                    //no intersection top
                                    var roadbottom = false;
                                }

                                var inter = new Intersection();
                                inter.x = r2.x, inter.y = r1.y, inter.width = r2.width, inter.height = r1.height, inter.roadtop = roadtop, inter.roadleft = roadleft, inter.roadright = roadright, inter.roadbottom = roadbottom;
                                testbed.intersections_arr.push(inter);
                                inter.draw();
                            }
                        }
                    }
                }
            }
        }
    }
}


function animloop() {
    drawscene();
    requestAnimFrame(animloop);
}

testbed.canvas.addEventListener('click', function (e) {

    let ClientRect = canvas.getBoundingClientRect();

    testbed.x = Math.round(e.clientX - ClientRect.left);
    testbed.y = Math.round(e.clientY - ClientRect.top);

    console.log("Coordenadas ("+testbed.x+", "+testbed.y+")");

    testbed.cars.forEach(isClicked);
    testbed.buildings.forEach(isClicked);
    testbed.tags.forEach(isClicked);
    testbed.trafficlights.forEach(isClicked);
    testbed.streetlights.forEach(isClicked);
    testbed.bridges.forEach(isClicked);
    testbed.barriers.forEach(isClicked);

    testbed.clicked = false;

}, false);




