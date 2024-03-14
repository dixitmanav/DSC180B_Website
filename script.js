// Create map instance
var map = L.map("map").setView([32.7157, -117.1611], 10);

// Add tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
function getColor(d) {
  return d > 0.8
    ? "#800026"
    : d > 0.6
    ? "#BD0026"
    : d > 0.4
    ? "#E31A1C"
    : d > 0.2
    ? "#FC4E2A"
    : "#FD8D3C";
}

// Function to load GeoJSON from file
function loadGeoJSON(filepath) {
  $.getJSON(filepath, function (jsonData) {
    var minDensity = Infinity;
    var maxDensity = -Infinity;
    // Calculate min and max density values dynamically
    jsonData.features.forEach(function (feature) {
      var density = feature.properties.business_density;
      if (density < minDensity) {
        minDensity = density;
      }
      if (density > maxDensity) {
        maxDensity = density;
      }
    });
    // Clear existing GeoJSON layers
    map.eachLayer(function (layer) {
      if (layer instanceof L.GeoJSON) {
        map.removeLayer(layer);
      }
    });
    // Add new GeoJSON layer to the map with style function and tooltips
    L.geoJSON(jsonData, {
      style: function (feature) {
        // Calculate color based on normalized density value
        var normalizedDensity =
          (feature.properties.business_density - minDensity) /
          (maxDensity - minDensity);
        return {
          fillColor: getColor(normalizedDensity),
          weight: 1,
          opacity: 1,
          color: "white",
          fillOpacity: 0.7,
        };
      },
      onEachFeature: function (feature, layer) {
        // Add tooltip to display the value of another variable
        var tooltipContent =
          "<b>TOTAL AREA STATISTICS<b><br>" +
          "<b>Total # of Jobs:</b> " +
          feature.properties["Total # of Jobs"] +
          "<br>" +
          "<b>Jobs for workers aged <=29:</b> " +
          feature.properties["Jobs for workers aged <=29"] +
          "<br>" +
          "<b>Jobs for workers aged 30-54:</b> " +
          feature.properties["Jobs for workers aged 30-54"] +
          "<br>" +
          "<b>Jobs for workers aged 55+:</b> " +
          feature.properties["Jobs for workers aged 55+"] +
          "<br>" +
          "<b>Jobs with earnings >=$1250/month:</b> " +
          feature.properties["Jobs with earnings >=$1250/month"] +
          "<br>" +
          "<b>Jobs with earnings $1251-$3333/month:</b> " +
          feature.properties["Jobs with earnings $1251-$3333/month"] +
          "<br>" +
          "<b>Jobs with earnings $3333+/month:</b> " +
          feature.properties["Jobs with earnings $1333+/month"] +
          "<br>";
        layer.bindTooltip(tooltipContent);
      },
    }).addTo(map);
  });
}

currentDir = "hexbins";
currentFile = "ret.json";
loadGeoJSON(currentDir + "/" + currentFile);

$("#hexbinBtn").click(function () {
  currentDir = "hexbins";
  loadGeoJSON(currentDir + "/" + currentFile);
});

$("#tractBtn").click(function () {
  currentDir = "tracts";
  loadGeoJSON(currentDir + "/" + currentFile);
});

$("#retBtn").click(function () {
  currentFile = "ret.json";
  loadGeoJSON(currentDir + "/" + currentFile);
});

$("#conBtn").click(function () {
  currentFile = "con.json";
  loadGeoJSON(currentDir + "/" + currentFile);
});

// Event listener for retail button
$("#profBtn").click(function () {
  currentFile = "prof.json";
  loadGeoJSON(currentDir + "/" + currentFile);
});

$("#healthBtn").click(function () {
  currentFile = "health.json";
  loadGeoJSON(currentDir + "/" + currentFile);
});
