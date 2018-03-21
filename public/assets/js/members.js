$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  var userId;
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    userId = data.id;
  });
  //  Grab trip Data then display Weather given trip
  $.get(`/api/trip_data`).then(function(data) {
    $(".tripName").text(`Trip Name: ${data.name}`);
    $(".tripLocation").text(`Trip Location: ${data.location}`);
    $(".dates").text(`${data.startdate} to ${data.enddate}`);
    var tripData = data;
    var startdate = new Date(tripData.startdate);
    var enddate = new Date(tripData.enddate);
    var daysArr = getDates(startdate, enddate);
    console.log(daysArr[0].getTime()/1000);
    console.log(daysArr[1].getTime()/1000);
    console.log(daysArr[2].getTime()/1000);

    //get Lat and Long of trip  then display data
    getLatandLong(tripData, daysArr[0].getTime()/1000);
    getLatandLong(tripData, daysArr[1].getTime()/1000);
    getLatandLong(tripData, daysArr[2].getTime()/1000);
  });
  $("#createTrip").on("click", function() {
    window.location.href = `/${userId}/trips/new`;
  });
});


function getLatandLong(tripData, time) {
  var geoAPIKey = "AIzaSyCrxhIkepDpKvWOFxZo5ypgb1OBpf7hcsw";
  var queryURL_geo = `https://maps.googleapis.com/maps/api/geocode/json?address=${tripData}&key=${geoAPIKey}`;
  $.ajax({
    url: queryURL_geo,
    method: "GET"
  }).done(function(response) {
    var geo = response.results[0].geometry.location;
    var geoLocation = `${geo.lat},${geo.lng}`;
    displayWeather(tripData, time, geoLocation);
  });
}
function displayWeather(tripData, time, geolocation) {
  var apiWeatherKey = "bd17eb5ba2562be86fea1fd5d3d248f7";
  console.log(geolocation);
  // var latitude = getLatandLong(tripData).lat;
  // var longitude = getLatandLong(tripData).long;
  // console.log(latitude);
  // console.log(longitude);
  // Either be a UNIX time (that is, seconds since midnight GMT on 1 Jan 1970) or a string formatted as follows: [YYYY]-[MM]-[DD]T[HH]:[MM]:[SS][timezone]. timezone should either be omitted (to refer to local time for the location being requested), Z (referring to GMT time), or +[HH][MM] or -[HH][MM] for an offset from GMT in hours and minutes.
  // var queryURL_Weather = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude},${time}`;
  var queryURL_Weather = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${apiWeatherKey}/${geolocation},${time}`;
  console.log(queryURL_Weather);

  $.ajax({
    url: queryURL_Weather,
    method: "GET"
  }).done(function(response) {
    $(".time").html(`<h1>${response.currently.time}</h1>`);
    var newDiv = `<div>Conditions: ${response.currently.summary}</div>
    <div>Weather: ${response.currently.apparentTemperature}&deg F</div>`;
    $(".weather").append(newDiv);
    console.log(response);
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
  var time =
    month + " " + date + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}
