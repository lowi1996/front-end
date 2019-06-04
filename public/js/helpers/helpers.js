
var log = function(log){
    console.log(log);
};


var isAgentActive = function(id){

    let isActive = false;

    $.ajax({
        type: "POST",
        url: "agent_active",
        data: {id : id},
        async : false,
        success : function(active){
            isActive = active;
        }
    });
    return isActive;
};


var loadContentModal = function(obj){

    $("#modalAgent > div").attr("id", obj.id); //asignamos id en modal para identificar elemento y actualziar estado en tiempo real
    $(".agent_id").html(obj.id);
    $(".agent_type").html(obj.type);
    $(".agent_x").html(obj.x);
    $(".agent_y").html(obj.y);
    $(".agent_status").html(obj.status);
    $("#more_info").attr("href", "agente/info/"+obj.id);

    if(isAgentActive(obj.id)) {
        $('#enviar').prop("disabled", false)
        $('#modalAgent .alerta').hide();
    }
};


var loadLogs = function(obj, type, data){

    if(obj.logger){
        var d = new Date()
        $('#logger').show();
        $('.logger_table').append('\
            <tr>\
                <th scope="row">'+obj.id+'</th>\
                <td>'+type+'</td>\
                <td>'+data+'</td>\
                <td>'+d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+'</td>\
            </tr>'
        )
        $("#logger .table-responsive").scrollTop($("#logger .table-responsive")[0].scrollHeight);
    }
}


var friendlyAttributtes = function(attributtes){

    var str = "";
    for (var idx in attributtes){
        str += idx+ ": "+attributtes[idx]+", ";
    }

    return str;
}