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

    var startdate = new Date(tripData.startdate);
    var enddate = new Date(tripData.enddate);
    var daysArr = getDates(startdate, enddate);
    var bgPhoto = tripData.background_photo;
    displayLocationPhoto(bgPhoto);
    //get Lat and Long of trip  then display data //simplifyThis
    //3 DAY FORECAST OF YOUR TRIP
    getLatandLong(tripData, daysArr[0].getTime() / 1000, "icon1");
    getLatandLong(tripData, daysArr[1].getTime() / 1000, "icon2");
    getLatandLong(tripData, daysArr[2].getTime() / 1000, "icon3");
  });
  $("#createTrip").on("click", function() {
    window.location.href = `/${userId}/trips/new`;
  });
});

function displayLocationPhoto(photoRefID) {
  var photoAPIKey = "AIzaSyBK99ou2DEGTdr67L12tIAc0YGgPyCEuIg";
  var photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRefID}&key=${photoAPIKey}`;
  var imgDiv = $(`<img src=${photoURL} alt="location-photo">`);
  $("#locationPhoto").append(imgDiv);
}

function getLatandLong(tripData, time, icon) {
  var geoAPIKey = "AIzaSyCrxhIkepDpKvWOFxZo5ypgb1OBpf7hcsw";
  var queryURL_geo = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=${tripData}&key=${geoAPIKey}`;
  $.ajax({
    url: queryURL_geo,
    method: "GET"
  }).done(function(response) {
    var geo = response.results[0].geometry.location;
    var geoLocation = `${geo.lat},${geo.lng}`;
    displayWeather(tripData, time, geoLocation, icon);
  });
}

function displayWeather(tripData, time, geolocation, icon) {
  var apiWeatherKey = "bd17eb5ba2562be86fea1fd5d3d248f7";
  // Either be a UNIX time (that is, seconds since midnight GMT on 1 Jan 1970) or a string formatted as follows: [YYYY]-[MM]-[DD]T[HH]:[MM]:[SS][timezone]. timezone should either be omitted (to refer to local time for the location being requested), Z (referring to GMT time), or +[HH][MM] or -[HH][MM] for an offset from GMT in hours and minutes.
  var queryURL_Weather = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${apiWeatherKey}/${geolocation},${time}`;

  $.ajax({
    url: queryURL_Weather,
    method: "GET"
  }).done(function(response) {
    var weatherIcon = response.currently.icon;
    var icons = new Skycons();
    //add your weatherIcon here
    icons.set(icon, weatherIcon);
    icons.play();
    var weatherAndtimeDiv = `<div class="container"> 
      ${timeConverter(response.currently.time)}
        <div class="row">Weather: ${
          response.currently.apparentTemperature
        }&deg F</div>
        <div class="row">Conditions: ${response.currently.summary}</div>
    </div>`;
    $(".time").append(weatherAndtimeDiv);
  });
}
// Returns an array of dates between the two dates
var getDates = function(startDate, endDate) {
  var dates = [],
    currentDate = startDate,
    addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = month + " " + date + " " + year;
  return time;
}
