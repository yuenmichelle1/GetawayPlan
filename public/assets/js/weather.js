var apiKey = "bd17eb5ba2562be86fea1fd5d3d248f7";
// The latitude of a location (in decimal degrees). Positive is north, negative is south.
var latitude;
// The longitude of a location (in decimal degrees). Positive is east, negative is west.
var longitude;
var time;
var queryURL= `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude},${time}`;