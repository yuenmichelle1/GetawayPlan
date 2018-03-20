var moment = require("moment");
$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  var userId;
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    userId = data.id;
  });
  //  Grab trip Data then display Weather given trip
  $.get("/api/trip_data").then(function(data) {
    $(".tripName").text(`Trip Name: ${data.name}`);
    $(".tripLocation").text(`Trip Location: ${data.location}`);
    $(".dates").text(`${data.startdate} to ${data.enddate}`);
    var tripData = data;
    displayWeather(tripData);
  });
  $("#createTrip").on("click", function() {
    window.location.href = `/${userId}/trips/new`;
  });
});

function displayWeather(tripData) {
  var apiWeatherKey = "bd17eb5ba2562be86fea1fd5d3d248f7";
  var latitude = getLatandLong(tripData).lat;
  var longitude= getLatandLong(tripData).long;
  var queryURL_Weather = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude},${time}`;


  $.ajax({
    url: queryURL_Weather,
    method: "GET"
  }).done(function(response) {
    $("#time").html(`<h1>${timeConverter(response.currently.time)}</h1>`);
    $("#weather").html(
        `<div>Conditions: ${response.currently.summary}</div>
        <div>Weather: ${response.currently.apparentTemperature}&deg F</div>`);
    console.log(response);
  });
}

function getLatandLong(tripData) {
  var googleaAPIKey = "AIzaSyCrxhIkepDpKvWOFxZo5ypgb1OBpf7hcsw";
  var queryURL_geo = `https://maps.googleapis.com/maps/api/geocode/json?address=${tripData}&key=${geoApiKey}`;
  $.ajax({
    url: queryURL_geo,
    method: "GET"
  }).done(function(response) {
    var geo = response.results[0].geometry.location;
    var geoLocation = `${geo.lat},${geo.lng}`;
    return geoLocation;
  });
}
