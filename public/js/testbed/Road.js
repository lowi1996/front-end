
function Road(x, y, width, height, color = "#605A4C", bridge = null){

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.border = 5 * 2; //borde carreteras
    this.color = color;
    this.bridge = bridge;

    this.draw = function() {

        if(!this.bridge){ // La carretera NO es un puente

            testbed.ctx.fillStyle = this.color;
            testbed.ctx.fillRect(this.x, this.y, this.width, this.height);

            testbed.ctx.fillStyle = "#A68B44";
            testbed.ctx.lineWidth = 1;

            if (this.width < this.height && this.width > 40) { // Lineas de las carreteras verticales

                testbed.ctx.fillRect(this.x + ((this.width / 2) - 1), this.y, 2, this.height);

                // Bordes carretera
                // Borde izquierdo
                testbed.ctx.fillStyle = "#ada295";
                testbed.ctx.fillRect(this.x - 10, this.y, this.border, this.height);
                // Borde derecho
                testbed.ctx.fillStyle = "#ada295";
                testbed.ctx.fillRect(this.x + this.width, this.y, this.border, this.height);

            }
            else if (this.width > this.height && this.height > 40) { // Lineas de las carreteras horizontales

                testbed.ctx.fillRect(this.x, this.y + ((this.height / 2) - 1), this.width, 2);

                // Bordes carretera
                // Borde de arriba
                testbed.ctx.fillStyle = "#ada295";
                testbed.ctx.fillRect(this.x - this.border, this.y - this.border, this.width + (2 * this.border), this.border);
                // Borde de abajo
                testbed.ctx.fillStyle = "#ada295";
                testbed.ctx.fillRect(this.x - this.border, this.y + this.height, this.width + (2 * this.border), this.border);

            }
            else if (this.width > this.height && this.height < 41) {
                testbed.ctx.fillRect(this.x, this.y + ((this.height / 2) - 1), this.width, 2);
                testbed.ctx.fillStyle = "#A09383";
                testbed.ctx.fillRect(this.x, this.y - 10, this.width, 10);
                testbed.ctx.fillStyle = "#A09383";
                testbed.ctx.fillRect(this.x, this.y + this.height, this.width, 10);
            }
            else if (this.width < this.height && this.width < 41) {
                testbed.ctx.fillRect(this.x + ((this.width / 2) - 1), this.y, 2, this.height);
                testbed.ctx.fillStyle = "#A09383";
                testbed.ctx.fillRect(this.x - 10, this.y, 10, this.height);
                testbed.ctx.fillStyle = "#A09383";
                testbed.ctx.fillRect(this.x + this.width, this.y, 10, this.height);
            }

        }else{ // La carretera SI es un puente

            this.bridge.draw();
        }
    }
}