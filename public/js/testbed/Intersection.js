
function Intersection(){

    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.roadtop = true;
    this.roadleft = true;
    this.roadbottom = true;
    this.roadright = true;
    if(left_green == true){
        this.right = "rgba(0,255,0,0.7)";
        this.left = "rgba(0,255,0,0.7)";
        this.top = "rgba(255,0,0,0.7)";
        this.bottom = "rgba(255,0,0,0.7)";
    }
    else{
        this.right = "rgba(255,0,0,0.7)";
        this.left = "rgba(255,0,0,0.7)";
        this.top = "rgba(0,255,0,0.7)";
        this.bottom = "rgba(0,255,0,0.7)";
    }

    this.draw = function(){
        testbed.ctx.fillStyle = "#605A4C";
        testbed.ctx.fillRect(this.x,this.y,this.width,this.height);
        testbed.ctx.lineWidth = 10; //ancho paso de zebra

        //zebra-crossing (left)
        if(this.roadleft == true){
            testbed.ctx.fillStyle = "#605A4C";
            testbed.ctx.fillRect(this.x-20,this.y,20,this.height);
            testbed.ctx.beginPath();
            testbed.ctx.setLineDash([1,5]);
            testbed.ctx.moveTo(this.x-12, this.y);
            testbed.ctx.lineTo(this.x-12, (this.y + this.height));
            testbed.ctx.closePath();
            testbed.ctx.strokeStyle = "#A09383";
            //testbed.ctx.lineWidth = 10;
            testbed.ctx.fill();
            testbed.ctx.stroke();

            testbed.ctx.fillStyle = "#A09383";
            testbed.ctx.fillRect(this.x-22,(this.height/2)+this.y-1,2,(this.height/2)+1);
            /* if(this.height > 40){
                 testbed.ctx.fillStyle = "#A09383";
                 testbed.ctx.fillRect(this.x-52,(this.height/(4/3))+this.y-2,30,2);
             }*/
        }
        //zebra-crossing (right)
        if(this.roadright == true){
            testbed.ctx.fillStyle = "#605A4C";
            testbed.ctx.fillRect(this.x+this.width,this.y,22,this.height);
            testbed.ctx.beginPath();
            testbed.ctx.setLineDash([1,5]);
            testbed.ctx.moveTo(this.x+this.width+12, this.y);
            testbed.ctx.lineTo(this.x+this.width+12, (this.y + this.height));
            testbed.ctx.closePath();
            testbed.ctx.strokeStyle = "#A09383";
            //testbed.ctx.lineWidth = 10;
            testbed.ctx.fill();
            testbed.ctx.stroke();

            testbed.ctx.fillStyle = "#A09383";
            testbed.ctx.fillRect(this.x+this.width+22,this.y,2,(this.height/2)+1);
            /*if(this.height > 40){
                testbed.ctx.fillStyle = "#A09383";
                testbed.ctx.fillRect(this.x+this.width+22,(this.height/4)+this.y-2,30,2);
            }*/
        }
        //zebra-crossing (top)
        if(this.roadtop == true){
            testbed.ctx.fillStyle = "#605A4C";
            testbed.ctx.fillRect(this.x,this.y-20,this.width,20);
            testbed.ctx.beginPath();
            testbed.ctx.setLineDash([1,5]);
            testbed.ctx.moveTo(this.x, this.y-12);
            testbed.ctx.lineTo((this.x + this.width), this.y-12);
            testbed.ctx.closePath();
            testbed.ctx.strokeStyle = "#A09383";
            //testbed.ctx.lineWidth = 10;
            testbed.ctx.fill();
            testbed.ctx.stroke();

            testbed.ctx.fillStyle = "#A09383";
            testbed.ctx.fillRect(this.x,this.y-21,(this.width/2)+1,2);
            /*if(this.width > 40){
                testbed.ctx.fillStyle = "#A09383";
                testbed.ctx.fillRect(this.x+(this.width/4)-2,this.y-50,2,30);
            }*/
        }
        //zebra-crossing (bottom)
        if(this.roadbottom == true){
            testbed.ctx.fillStyle = "#605A4C";
            testbed.ctx.fillRect(this.x,this.y+this.height,this.width,20);
            testbed.ctx.beginPath();
            testbed.ctx.setLineDash([1,5]);
            testbed.ctx.moveTo(this.x, this.y+this.height+12);
            testbed.ctx.lineTo((this.x + this.width), this.y+this.height+12);
            testbed.ctx.closePath();
            testbed.ctx.strokeStyle = "#A09383";
            //testbed.ctx.lineWidth = 10;
            testbed.ctx.fill();
            testbed.ctx.stroke();

            testbed.ctx.fillStyle = "#A09383";
            testbed.ctx.fillRect(this.x+this.width-(this.width/2)-1,this.y+this.height+20,(this.width/2)+1,2);
            /*if(this.width > 40){
                testbed.ctx.fillStyle = "#A09383";
                testbed.ctx.fillRect(this.x+(this.width/(4/3))-2,this.y+this.height+20,2,30);
            }*/
        }
    }
}