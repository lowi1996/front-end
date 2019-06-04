
function Tag(id, x, y, d){

	this.id = id;
	this.x = x;
	this.y = y;
	this.type = "Tag RFID";
	this.width = 6;
	this.height = 6;
	this.d = d;
	this.color = "#393939";
	this.status = "Activo"
}

Tag.prototype.isClicked = function() {

	if (testbed.y > (this.y - this.height/2) && testbed.y < (this.y + this.height/2) &&
        testbed.x > (this.x - this.width/2) && testbed.x < (this.x + this.width/2)) {
		clicked = true;
		this.loadContentModal()
	}
};

Tag.prototype.draw = function() {

	testbed.ctx.beginPath();
    //testbed.ctx.setLineDash([]);
    testbed.ctx.lineWidth = 1;
	testbed.ctx.arc(this.x, this.y, this.width/2, 0 * Math.PI, 2 * Math.PI);
	testbed.ctx.fillStyle = this.color;
	testbed.ctx.fill();
	testbed.ctx.strokeStyle = this.color;
	testbed.ctx.stroke();
}


Tag.prototype.loadContentModal = function() {

    loadContentModal(this);
    this.extraLoadContentModal()
    $('#modalAgent').modal('show')
}

Tag.prototype.extraLoadContentModal = function() {
};
