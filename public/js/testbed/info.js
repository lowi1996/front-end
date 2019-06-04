'use strict'

const socket = io.connect('http://'+config.host+':'+config.port, {'forceNew' : true});


socket.on("connect", function(){

    console.info("Conectado con el servidor")

});


socket.on('front/agent/status', (data) => {

    if(data.agent_id == $("#id_agente").val()){

        var d = new Date()
        $('#logger-info-table').append('\
                <tr>\
                    <th scope="row">'+data.agent_id+'</th>\
                    <td>'+data.status+'</td>\
                    <td>'+d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+'</td>\
                </tr>'
        )
        $("#logger-info .table-responsive").scrollTop($("#logger-info .table-responsive")[0].scrollHeight);
    }
});

socket.on('front/agent/attributtes', (data) => {

    if(data.agent_id == $("#id_agente").val()){

        $('#attributes').html(loadAttributes(data.attributtes));

        var d = new Date()
        $('#logger-info-table').append('\
                <tr>\
                    <th scope="row">'+data.agent_id+'</th>\
                    <td>Cambio de atributos</td>\
                    <td>'+d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+'</td>\
                </tr>'
        )
        $("#logger-info .table-responsive").scrollTop($("#logger-info .table-responsive")[0].scrollHeight);
    }
});


socket.on("info/agent/get/response", (data) => {

});


function loadAttributes(attributes){

    var html = `attributes:<ul class="list-group">`;
    for(var index2 in attributes) {
        if (typeof attributes[index2] == "object") {
            html += `<li class="list-group-item">${index2}:
                        <ul class="list-group">`;
            for (var index3 in attributes[index2]){
                html += `<li class="list-group-item">${index3}: ${attributes[index3]}</li>`;
            }
            html += `</ul></li>`;
        }else
            html += `<li class="list-group-item">${index2}: ${attributes[index2]}</li>`;

    }
    html += `</ul>`;

    return html;
}
