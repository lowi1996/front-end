'use strict'

const agent_id = window.location.pathname.split("/")[3]
const agent_info = $('#agent_info')
const services_to_execute = $('#services')
var agent = null;
var services = null;
get_agent_info()
get_services_to_execute()


$(document).delegate('form', 'submit', function(event) {
    var form = $(this);
    var inputs = form.find(":input")
		var params = {};
		var service_id = "";
		for(var i = 0; i < inputs.length; i++) {
			if(inputs[i].localName == "input") {
				if(inputs[i].name != "service_id") {
					params[inputs[i].name] = inputs[i].value;
				}
				else {
					service_id = inputs[i].value;
				}
			}
		}
		execute_service(service_id, params)
		return false;
});

function execute_service(service_id, params) {
	var service = {
		'service_id': service_id,
		'params': params
	}
  console.log(service)
	$.ajax({
		url: "http://"+agent["myIP"]+":8000/request_service",
		contentType: "application/json",
    dataType: "json",
		type: 'post',
		data: service
	});
	// $.post("http://"+agent["myIP"]+":8000/request_service", service);
	// alert("He solicitado el servicio a " + agent["myIP"]);
}

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
	var body = "";
	$.each(services, function(index, value){
		body += "<button class='accordion'>"+value["description"]+"</button>";
		var form_body = "<form>"
		var service_params = value["params"]
		if(service_params) {
			$.each(service_params, function(index, value) {
				form_body += index+": <input type='"+value+"' name='"+index+"'><br>"
			});
		}
		form_body += "<input type='hidden' name='service_id' value='"+value["_id"]+"'>"
		form_body += "<button type='submit' style='float: right'>Ejecutar servicio</button>"
		form_body += "</form>"
		body += "<div class='panel'>"+form_body+"</div>";
	});
	services_to_execute.append(body)
	hide_accordion()
}

function hide_accordion() {
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
	  acc[i].addEventListener("click", function() {
	    this.classList.toggle("active");
	    var panel = this.nextElementSibling;
	    if (panel.style.maxHeight){
	      panel.style.maxHeight = null;
	    } else {
	      panel.style.maxHeight = panel.scrollHeight + "px";
	    }
	  });
	}
}
