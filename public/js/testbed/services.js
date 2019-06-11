'use strict'


var columns = ["nodeID", "device", "role", "zone", "myIP", "leaderIP", "port", "broadcast"]
var id_services = {}
const hostname = location.hostname


var table = $("#table")

build_header();
get_data_from_DB()

// setInterval(get_data_from_DB(), 2000);
setInterval(get_data_from_DB, 2000);

function build_header() {
	var head = "<tr>";
	$.each(columns, function( index, column ) {
	  head += "<th>" + column + "</th>";
	});
	head += "</tr>";
	table.find('thead').append(head);
}

function get_data_from_DB(){
	var url = 'http://'+hostname+':8080/get_serviceDB'
	params = {}
	$.get(url, params, function(data){
		data.splice(data.length-2,2)
	    data = data.join()
	    // data = data.substr(1, data.length-2)
	    data = JSON.parse(data)
	    build_body(data)
	});
}

function build_body(agents) {
	var body = ""
	$.each(services, function( index, service) {
		if(service["_id"]){
			id_services[service["_id"]] = service
		}
		body += "<tr>"
		$.each(columns, function( index, column ) {
			if (service[column] != null){
				body += "<td>" + service[column] + "</td>";
			}else{
				body += "</td>"
			}
		});
		body += "</tr>"
	});
    table.find('tbody').empty();
    table.find('tbody').append(body);
}
