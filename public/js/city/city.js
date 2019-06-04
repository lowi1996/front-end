const socket = io.connect('http://'+config.host+':'+config.port, {'forceNew' : true});

var map;

const images =[
    {url: 'img/icons/cars/red-car.png', id: 'red-car'},
    {url: 'img/icons/cars/green-car.png', id: 'green-car'},
    {url: 'img/icons/cars/purple-car.png', id: 'purple-car'},
    {url: 'img/icons/cars/black-car.png', id: 'black-car'},
    {url: 'img/icons/ambulance.png', id: 'ambulance'},
    {url: 'img/icons/firefighters.png', id: 'firefighters'},
    {url: 'img/icons/trafficlight/trafficlight.png', id: 'trafficlight'},
    {url: 'img/icons/trafficlight/red.png', id: 'red'},
    {url: 'img/icons/trafficlight/yellow.png', id: 'yellow'},
    {url: 'img/icons/trafficlight/green.png', id: 'green'},
    {url: 'img/icons/trafficlight/emergency-red.png', id: 'emergency-red'},
    {url: 'img/icons/trafficlight/emergency-yellow.png', id: 'emergency-yellow'},
    {url: 'img/icons/trafficlight/emergency-green.png', id: 'emergency-green'},
    {url: 'img/icons/streetlight.png', id: 'streetlight'},
    {url: 'img/icons/craax.png', id: 'craax'},
]

socket.on("connect", function(){

    console.info("Inicializando ciudad...");

    mapboxgl.accessToken = config.accesToken_mapBox;
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 15.3,
        center: [1.725814, 41.225351], //[longitud, latitud]
    });

    map.on('load', function () {
        console.info("Cargado Mapa");

        images.forEach(img => {
            map.loadImage(img.url, function(error, res) {
                map.addImage(img.id, res)
            })
        });

        //Enlace a TestBed - CRAAX
        map.addLayer({
            "id": "testbed",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [1.733690, 41.223548]
                        },
                        "properties": {
                            "title": "TestBed",
                            "icon": "craax"
                        }
                    }]
                }
            },
            "layout": {
                "icon-image": "{icon}",
                "text-field": "{title}",
                "text-offset": [0,1],
                "text-size" : 19,
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-anchor": "top"
            }
        });

        map.on('click',"testbed", function (e) {
            window.location.href = "/testbed";
        });



        socket.on("agent/recognition", (data_agente) => {

            map.addSource(data_agente.id, {
                type: 'geojson',
                data: {
                    geometry: {
                        type: "Point",
                        coordinates: [data_agente.longitude, data_agente.latitude]
                    },
                    type: "Feature",
                    properties: {
                        "name" : data_agente.id
                    }
                }
            });
            map.addLayer({
                "id": data_agente.id,
                "type": "symbol",
                "source": data_agente.id,
                "layout": {
                    "icon-image": data_agente.type
                }
            });

            map.on('click', data_agente.id, function (e) {
                //console.log(e.features[0]);
                var coordinates = e.features[0].geometry.coordinates.slice();
                var html = `<div><ul>
                                <li>ID: ${data_agente.id}</li>
                                <li>Descripción: ${data_agente.description}</li>
                                <li>Tipo posicionamiento: ${data_agente.description}</li>
                                <li>Coordenadas: lng: ${coordinates[0]}, ltd: ${coordinates[1]} </li>
                            </ul>
                            <a class="btn btn-info" target="_blank" href="agente/info/${data_agente.id}">+ INFO</a>
                            </div>`;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(html)
                    .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', data_agente.id, function () {
                map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', data_agente.id, function () {
                map.getCanvas().style.cursor = '';
            });

            console.info("Conectado agente "+data_agente.type+" #"+data_agente.id)
        });

        socket.on("agent/position", function(data){

            service_demo(map, data);

            map.getSource(data.agent_id).setData({
                geometry: {
                    type: "Point",
                    coordinates: [data.position[0], data.position[1]]
                },
                type: "Feature",
                properties: {}
            });
            console.info("Recibida posición de agente: "+data.agent_id+ " "+data.position);
        });

        socket.on('agent/status', (data) => {
            map.setLayoutProperty(data.agent_id, "icon-image", data.status);
            console.info("Recibido estado de agente: "+data.agent_id+ " "+data.status);
        });
    });
});


function service_demo(map, data){

    if(data.agent_id == "VA1") {
        if (data.position[0] == 1.728724 && data.position[1] == 41.230485) {
            console.log("Forzado cambio de estado semaforo " + data.agent_id)
            map.setLayoutProperty("TF4", "icon-image", "emergency-green");
            map.setLayoutProperty("TF5", "icon-image", "emergency-red");
        }

        if (data.position[0] == 1.7324201 && data.position[1] == 41.2256153) {
            console.log("Forzado cambio de estado semaforo " + data.agent_id)
            map.setLayoutProperty("TF6", "icon-image", "eme rgency-green");
            map.setLayoutProperty("TF2", "icon-image", "emergency-red");
            map.setLayoutProperty("TF1", "icon-image", "emergency-red");
        }
        if (data.position[0] == 1.7330933 && data.position[1] == 41.2247034) {
            console.log("Forzado cambio de estado semaforo " + data.agent_id)
            map.setLayoutProperty("TF6", "icon-image", "emergency-red");
            map.setLayoutProperty("TF2", "icon-image", "emergency-red");
            map.setLayoutProperty("TF1", "icon-image", "emergency-green");
        }
        if (data.position[0] == 1.7298901 && data.position[1] == 41.2300873) {
            console.log("Forzado cambio de estado semaforo " + data.agent_id)
            map.setLayoutProperty("TF4", "icon-image", "emergency-green");
            map.setLayoutProperty("TF5", "icon-image", "emergency-red");
        }
    }else{
        if(data.agent_id == "VF2"){
            if ((data.position[0] == 1.7219199 && data.position[1] == 41.219599) ||
                (data.position[0] == 1.7227379 && data.position[1] == 41.2198774)){
                console.log("Forzado cambio de estado semaforo " + data.agent_id)
                map.setLayoutProperty("TF7", "icon-image", "emergency-green");
            }
            if ((data.position[0] == 1.7269195 && data.position[1] == 41.2210758)) {
                console.log("Forzado cambio de estado semaforo " + data.agent_id)
                map.setLayoutProperty("TF8", "icon-image", "emergency-green");
            }
            if (data.position[0] == 1.7282955 && data.position[1] == 41.2215559) {
                console.log("Forzado cambio de estado semaforo " + data.agent_id)
                map.setLayoutProperty("TF8", "icon-image", "emergency-green");
            }
        }
    }
}









