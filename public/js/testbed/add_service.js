'use strict'

const hostname = location.hostname
const port = location.port


$(document).delegate('form', 'submit', function(event) {
    var form = $(this)[0].elements;
    console.log(form)

	//execute_service(service_id, params)
	return false;
});
