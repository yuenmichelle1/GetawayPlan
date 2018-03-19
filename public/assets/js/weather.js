var apiKey = "bd17eb5ba2562be86fea1fd5d3d248f7";
// The latitude of a location (in decimal degrees). Positive is north, negative is south.
var latitude = 41.8781;
// The longitude of a location (in decimal degrees). Positive is east, negative is west.
var longitude = -87.6298;
// Either be a UNIX time (that is, seconds since midnight GMT on 1 Jan 1970) or a string formatted as follows: [YYYY]-[MM]-[DD]T[HH]:[MM]:[SS][timezone]. timezone should either be omitted (to refer to local time for the location being requested), Z (referring to GMT time), or +[HH][MM] or -[HH][MM] for an offset from GMT in hours and minutes.
var time = "2018-10-10T15:30:30";
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
