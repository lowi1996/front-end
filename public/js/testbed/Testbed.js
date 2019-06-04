

function Testbed(){

    // VARIABLES GLOBALES del TESTBED
    this.canvas = document.getElementsByTagName("canvas")[0];
    this.ctx = canvas.getContext("2d");

    this.margin = 70 * 2; //margen testbed donde van los edificios
    this.width = 59 * 2; //ancho carreteras
    this.border = 5 * 2; //borde carreteras
    this.w = 536 * 2 + (this.margin * 2);
    this.h = 338 * 2 + (this.margin * 2);

    this.canvas.width = this.w;
    this.canvas.height = this.h;


    this.x; // Coordenada x clicada en el canvas
    this.y; // Coordenada y clicada en el canvas
    this.clicked = false;

    // ARRAYS
    this.elementos = []; //Guarda los elementos clickables del testbed
    this.roads = []; //Guarda las carreteras
    this.bridges = []; //Guarda los puentes
    this.buildings = []; //Guarda los edificios
    this.trafficlights = []; //Guarda los semáforos
    this.streetlights = []; //Guarda las farolas
    this.barriers = []; //Guarda las barreras
    this.intersections_arr = []; //Guarda las intersecciones de las carreteras
    this.cars = []; //Guarda los vehiculos
    this.tags = []; //Guarda los tags
    this.drive = false;
    this.agents = []; //Guarda todos los agents

    //Imagen CRAAX
    this.craax_img = new Image();
    this.craax_img.src = "img/craax.png";


    Object.getPrototypeOf(this.ctx).rounded_rect = function(x,y,w,h,r){
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
    };
}