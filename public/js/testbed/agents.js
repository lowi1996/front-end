'use strict'


var columns = ["nodeID", "device", "role", "myIP", "leaderIP", "port", "broadcastIP"]
var id_agents = {}
const hostname = location.hostname


var table = $("#taula")

var filterNodeID = ""
var filterDevice = ""
var filterRole = ""
var filterZone = ""
var filterStatus = ""

build_header();

get_data_from_DB()

// setInterval(get_data_from_DB(), 2000);
setInterval(get_data_from_DB, 2000);

$("#filtro").submit(function() {
	filter()
	return false;
})

$('#taula tbody').on('click', 'tr', function() {
	var agent_id = $(this).find("td:first").text();
	if(id_agents[agent_id]["status"] == 1){
		window.location.pathname = "/agents/agent/"+agent_id;
	}
})

function filter() {
	filterNodeID = $("#nodeID").val();
	filterDevice = $("#device").val();
	filterRole = $("#role").val();
	filterZone = $("#zone").val();
	filterStatus = $("#status").val();
	get_data_from_DB();
}

function build_header() {
	var head = "<tr>";
	$.each(columns, function( index, column ) {
	  head += "<th>" + column + "</th>";
	});
	head += "</tr>";
	table.find('thead').append(head);
}

function get_data_from_DB(){
//	var url = 'http://10.0.2.16:8080/get_topoDB'
//	var url = 'http://127.0.0.1:8080/get_topoDB'
	var url = 'http://'+hostname+':8080/get_topoDB'
	var params = ""
	params += addFilter("nodeID", filterNodeID);
	params += addFilter("device", filterDevice);
	params += addFilter("role", filterRole);
	params += addFilter("zone", filterZone);
	params += addFilter("status", filterStatus);

	if(params != ""){
		params = params.slice(0, -1);
		params = "selec={"+ params + "}";
	}
	$.get(url, params, function(data){
		data.splice(data.length-2,2)
	    data = data.join()
	    // data = data.substr(1, data.length-2)
	    data = JSON.parse(data)
	    build_body(data)
	});
}

function addFilter( id, value){
	if(value != ""){
		return "'"+id+"':"+"'"+value+"',"
	}else{
		return ""
	}
}

function build_body(agents) {
	var body = ""
	$.each(agents, function( index, agent ) {
		if(agent["nodeID"]){
			id_agents[agent["nodeID"]] = agent
		}
		if(agent["status"] != null){
			if(agent["status"] == "0"){
				body += "<tr class='status-KO'>" ;
			}
	        else {
				body += "<tr>" ;
	        }
	        $.each(columns, function( index, column ) {
	        	if (agent[column] != null){
					body += "<td>" + agent[column] + "</td>";
				}else{
					body += "<td/>"
				}
			});
	        body += "</tr>"
		}
    })
    table.find('tbody').empty();
    table.find('tbody').append(body);

}
