//url link
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Create the tile layer that will be the background of our map.
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create our initial map object.
// Set the longitude, latitude, and starting zoom level.
var myMap = L.map("map", {
    center: [37.6000, -95.6650],
    zoom: 5,
    layers: streetmap
});


// Get the data with d3.
d3.json(url).then(function(data) {
    console.log(data);

    var features = data.features;
    var depths = [];
    //var [minDepth, maxDepth] = d3.extent(depths);

    for (var i = 0; i < features.length; i++) {
        var coordinates = features[i].geometry.coordinates;
        var lat = coordinates[1];
        var lon = coordinates[0];
        var depth = coordinates[2];
        var properties = features[i].properties;
        var place = properties.place;
        var mag = properties.mag;
        
        // Create a red circle over Dallas.
        circle = L.circleMarker([lat, lon], {
            color: "grey",
            fillColor: circleColor(depth),
            fillOpacity: 0.75,
            radius: circleRadius(mag),
            weight: 0.75
        }).bindPopup(`<h3>${place}</h3><h4>Magnitude: ${mag}<br/>Depth: ${depth} KM<br></h4>`
        ).addTo(myMap);
    };
});

function circleRadius(mag) {return mag * 6};

// Create function to select the color to fill the circles
function circleColor(depth) {
    if (depth <= 10) 
    return "#9AFF33"

    else if (depth <= 30) 
    return "#D3FF33"

    else if (depth <= 50) 
    return "#FFE733"

    else if (depth <= 70) 
    return "#FFB733"

    else if (depth <= 90) 
    return "#FF6F33"

    else if (depth > 90) 
    return "#FF5433"
};

  // Add legend (don't forget to add the CSS from index.html)
var legend = L.control({position: "bottomleft"});
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend')
    
    div.innerHTML += '<h3>Earthquake depths (km)</h3>';
    div.innerHTML += '<i style = "background: #9AFF33"></i><span>-10 - 10</span><br>';
    div.innerHTML += '<i style = "background: #D3FF33"></i><span>10 - 30</span><br>';
    div.innerHTML += '<i style = "background: #FFE733"></i><span>30 - 50</span><br>';
    div.innerHTML += '<i style = "background: #FFB733"></i><span>50 - 70</span><br>';
    div.innerHTML += '<i style = "background: #FF6F33"></i><span>70 - 90</span><br>';
    div.innerHTML += '<i style = "background: #FF5433"></i><span>90+</span><br>';
    return div;
};

legend.addTo(myMap)