'use strict'

var columns = {
	"ID": "_id",
	"Descripcion": "description",
	"Codigo": "code",
	"IoT": "IoT",
	"Parametros": "params",
	"Versio de python": "python_version",
	"Dependiencias": "dependencies",
	"Servicio Infinito": "is_infinite",


}
var id_services = {}
const hostname = location.hostname

function add_service() {
	window.location.href = '/services/add_service'
}

var table = $("#table")

build_header();
get_data_from_DB()

function build_header() {
	var head = "<tr>";
	$.each(columns, function( key, column ) {
	  head += "<th>" + key + "</th>";
	});
	head += "</tr>";
	table.find('thead').append(head);
}

function get_data_from_DB(){
	var url = 'http://'+hostname+':8080/get_serviceDB'
	var params = {}
	$.get(url, params, function(data){
			if(data) {
				data.splice(data.length-2,2)
				data = data.join()
				data = JSON.parse(data)
				build_body(data)
			}
	});
}

function build_body(services) {
	var body = ""
	$.each(services, function( index, service) {
		if(service["_id"]){
			id_services[service["_id"]] = service
		}
		body += "<tr>"
		$.each(columns, function( key, column ) {
			if (service[column] != null){
				var s = JSON.stringify(service[column])
				s = s.split('"').join('')
				body += "<td>" + s + "</td>";
			}else{
				body += "<td> </td>";
			}
		});
		body += "</tr>"
	});
    table.find('tbody').empty();
    table.find('tbody').append(body);
}
