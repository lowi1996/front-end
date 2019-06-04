
var map = L.map('map', {
    maxZoom: 20
}).setView([41.222007, 1.726395], 15);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/*var greenIcon = L.icon({
    iconUrl: 'assets/images/social/img1.jpg',
    shadowUrl: 'assets/images/social/profile.jpg',

    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});*/

var gl = L.mapboxGL({
    accessToken: 'no-token',
    style: 'https://raw.githubusercontent.com/osm2vectortiles/mapbox-gl-styles/master/styles/bright-v9-cdn.json'
}).addTo(map);

/*var LeafIcon = L.Icon.extend({
    options: {
        shadowUrl: 'assets/images/social/img1.jpg',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    }
});*/


var markers = L.markerClusterGroup();

for (var i = 0; i < addressPoints.length; i++) {
    var a = addressPoints[i];
    var title = a[2];
    var marker = L.marker(new L.LatLng(a[0], a[1]), {
        title: title
    });
    marker.bindPopup(title);
    markers.addLayer(marker);
}

map.addLayer(markers);