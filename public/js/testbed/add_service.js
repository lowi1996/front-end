'use strict'

const hostname = location.hostname
const port = location.port


$(document).delegate('form', 'submit', function(event) {
    var form = $(this)[0].elements;
    var reg_service = {}
    var files = new FormData()
    try{
        for(var i = 0; i < form.length; i++){
            if(form[i].type == 'text' || form[i].type == 'select-one' || form[i].type == 'number'){
                reg_service[form[i].name] = form[i].value
            }else if(form[i].type == 'checkbox'){
                reg_service[form[i].name] = form[i].checked
            }else if(form[i].type == 'file'){
                if(form[i].name == 'service_file'){
                    var service_file = form[i].files[0]
                    reg_service["code"] = service_file.name
                    files.append(service_file.name, service_file)
                }else if(form[i].files){
                    reg_service["dependencies_codes"] = "util.py"
                    for(var j = 0; j < form[i].files.length; j++){
                        reg_service["dependencies_codes"] += " " + form[i].files[j].name
                        files.append(form[i].files[j].name, form[i].files[j])
                    }
                }
            }
            reg_service["download_host"] = hostname
            reg_service["download_port"] = port
        }
        $.ajax({
            type: "POST",
            url: "http://"+hostname+":"+port+"/upload",
            data: files,
            cache: false,
            contentType: false,
            processData: false,
            success: function(){
                console.log("Ficheros subidos correctamente")
            },
            fail: function(xhr, textStatus, errorThrown) {
                console.log(errorThrown)
            }
        });
        var url = 'http://'+hostname+':8080/post_service'
        console.log(reg_service)
        alert("pausa")
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(reg_service),
            contentType: "application/json",
            success: function(){
                alert("Se ha añadido el servicio al catalogo correctamente");
                window.location.pathname = "/services"
            },
            fail: function(xhr, textStatus, errorThrown) {
                alert("No se ha podido añadir el servicio al catalogo");
                console.log(errorThrown)
            }
        });
    }catch(err){
        console.log(err)
    }
    console.log(reg_service)
	  return false;
});
