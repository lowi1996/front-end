'use strict'

const agent_id = window.location.pathname.split("/")[3]
const agent_info = $('#agent_info')
const services_to_execute = $('#services')
var agent = null;
var services = null;
get_agent_info()
get_services_to_execute()

function get_agent_info() {
	var url = 'http://10.0.2.16:8080/get_topoDB'
	//var url = 'http://127.0.0.1:8080/get_topoDB'
	var params = "selec={'nodeID':'"+agent_id+"'}"
	$.get(url, params, function(data){
		data.splice(data.length-2,2)
		data = data.join()
		// data = data.substr(1, data.length-2)
		agent = JSON.parse(data)[0]
		show_agent_info()
	});
}
function get_services_to_execute() {
	var url = 'http://10.0.2.16:8080/get_serviceDB'
	var params = null
	//var url = 'http://127.0.0.1:8080/get_serviceDB'
	$.get(url, params, function(data){
		data.splice(data.length-2,2)
		data = data.join()
		// data = data.substr(1, data.length-2)
		services = JSON.parse(data)
		show_service_to_execute()
	});
}

function show_agent_info(){
	var body = "<ul>";
	// alert(agent)
	// body += "<li> Información del nodo</li>"
	if(agent){
		body += "<li><b>nodeID</b>: " + agent['nodeID'] + "</li>"
		$.each(agent, function( key, value ) {
			if (agent[key] != null && key != "_id" && key != "nodeID"){
				body += "<li><b>" + key + "</b>: " + agent[key] + "</li>"
			}
		});
		body += "</ul>";
		// agent_info.empty()
		agent_info.append(body)
	}
}

function show_service_to_execute(){

}
