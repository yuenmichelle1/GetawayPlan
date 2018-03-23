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
    $(".tripName").text(`${data.name}`);
    $(".tripLocation").text(`${data.location}`);
    $(".tripDates").text(`${data.startdate} - ${data.enddate}`);
    var tripData = data;

    var startdate = new Date(tripData.startdate);
    var enddate = new Date(tripData.enddate);
    var daysArr = getDates(startdate, enddate);
    // bgPhoto is a reference ID to a photo on google that needs to be input 
    var bgPhoto= tripData.background_photo;
    if (bgPhoto === "") {
         $('.trip-bg').css('background', `url("/assets/img/getaway.jpg") no-repeat center fixed`);
        $('.trip-bg').css('background-size', `cover`);
        $('.trip-bg').css('background-color', `rgba(0,0,0,.2)`);
        $('.trip-bg').css('background-blend-mode', `overlay`);
        
    } else{
        displayLocationPhoto(bgPhoto);
    }
    //get Lat and Long of trip  then display data //simplifyThis
    //3 DAY FORECAST OF YOUR TRIP
    getLatandLong(tripData, daysArr[0].getTime()/1000, "icon1", "weather1-text");
    getLatandLong(tripData, daysArr[1].getTime()/1000, "icon2", "weather2-text");
    getLatandLong(tripData, daysArr[2].getTime()/1000, "icon3", "weather3-text");
  });
  $("#createTrip").on("click", function() {
    window.location.href = `/${userId}/trips/new`;
  });

  $("#addPoi").on("click", function() {
    window.location.href = `pois/new`;
  });

  $("#addRest").on("click", function() {
    window.location.href = `/restaurants/new`;
  });

});

function displayLocationPhoto(photoRefID) {
    // first key
    var photoAPIKey = "AIzaSyBK99ou2DEGTdr67L12tIAc0YGgPyCEuIg";
    // var photoAPIKey = "AIzaSyBxMhiK9gIVQw4-_44ToFukjwwmJ1pmT-w";
    // var photoAPIKey = "AIzaSyB4NWEUkE-1dK_OTGQJKzHECzuOVyWZJFw";
    // backup key
    // var photoAPIKey ="AIzaSyDlhX_mMtwzLxh19L43QpJEV41mRBCNP0k";
    var photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=700&photoreference=${photoRefID}&key=${photoAPIKey}`;
    $('.trip-bg').css('background', `url("${photoURL}") no-repeat center fixed`);
    $('.trip-bg').css('background-size', `cover`);
    $('.trip-bg').css('background-color', `rgba(0,0,0,.2)`);
    $('.trip-bg').css('background-blend-mode', `overlay`);
}

function getLatandLong(tripData, time, icon, divClass) {
    var geoAPIKey = "AIzaSyCrxhIkepDpKvWOFxZo5ypgb1OBpf7hcsw";
    var queryURL_geo = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=${tripData}&key=${geoAPIKey}`;
    $.ajax({
        url: queryURL_geo,
        method: "GET"
    }).done(function(response) {
        var geo = response.results[0].geometry.location;
        var geoLocation = `${geo.lat},${geo.lng}`;
        displayWeather(tripData, time, geoLocation, icon, divClass);
    });
}

function displayWeather(tripData, time, geolocation, icon, divClass) {
    var apiWeatherKey = "bd17eb5ba2562be86fea1fd5d3d248f7";
    // Either be a UNIX time (that is, seconds since midnight GMT on 1 Jan 1970) or a string formatted as follows: [YYYY]-[MM]-[DD]T[HH]:[MM]:[SS][timezone]. timezone should either be omitted (to refer to local time for the location being requested), Z (referring to GMT time), or +[HH][MM] or -[HH][MM] for an offset from GMT in hours and minutes.
    var queryURL_Weather = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${apiWeatherKey}/${geolocation},${time}`;

    $.ajax({
        url: queryURL_Weather,
        method: "GET"
    }).done(function(response) {
        var weatherIcon = response.currently.icon;
        var icons = new Skycons({"color": "white"});
        //add your weatherIcon here
        icons.set(icon, weatherIcon);
        icons.play();
        displayTime(divClass,response.currently.time, response.currently.apparentTemperature);
    });
}

function displayTime(cl, date, temp) {
    $(`.${cl}`).html(`${timeConverter(date)}: ${Math.round(temp)}°F`);
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
    var months = [ "Jan",  "Feb",  "Mar", "Apr", "May","Jun", "Jul", "Aug", "Sep","Oct","Nov", "Dec"];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = `${month} ${date}` ;
    return time;
}