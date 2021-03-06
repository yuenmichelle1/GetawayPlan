$("#createNewTrip").on("click", function () {
  var userId;
  var autocompleteLocation = $("#autocomplete").val();
  var startDate = $("#from").val();
  var endDate = $("#to").val();
  var tripName = $("#tripName").val().trim();
  var tripPhotoRefId;

  $.get("/api/user_data", function (data) {
    userId = data.id;
    console.log(userId);

    checkDataFilled();
  });
  //

  function checkDataFilled() {
    if (autocompleteLocation === "") {
      // replace with modal later
      alert("Enter Address");
    } else if (endDate === "" || startDate === "") {
      // replace with modal later
      alert("Enter Dates");
    } else {
      // sendData();
      grabBGImg();
    }
  }

  function grabBGImg() {
    // grab geolocation
    var geoApiKey = "AIzaSyCrxhIkepDpKvWOFxZo5ypgb1OBpf7hcsw";
    var queryURL_geo = `https://maps.googleapis.com/maps/api/geocode/json?address=${autocompleteLocation}&key=${geoApiKey}`;
    $.ajax({
      url: queryURL_geo,
      method: "GET"
    }).done(function (response) {
      // same as photoAPI KEY
      // var googlePlaceApiKey = "AIzaSyBK99ou2DEGTdr67L12tIAc0YGgPyCEuIg";
      //backup
      var googlePlaceApiKey= "AIzaSyDlhX_mMtwzLxh19L43QpJEV41mRBCNP0k";
      var geo = response.results[0].geometry.location;
      var geoLocation = `${geo.lat},${geo.lng}`;
      var queryURL_pictures = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${geoLocation}&radius=500&rankby=prominence&key=${googlePlaceApiKey}`;
      $.ajax({
        url: queryURL_pictures,
        method: "GET"
      }).done(function (response) {
        if (!response.results[0].photos) {
          tripPhotoRefId = null;
        } else {
          var bigPhotoResults =response.results.filter(checkPhotoWidth);
          tripPhotoRefId = bigPhotoResults[0].photos[0].photo_reference;
          // tripPhotoRefId = response.results[0].photos[0].photo_reference;
        }
        sendData(tripPhotoRefId);
      }).error(function () {
        tripPhotoRefId = null;
      })
    });
  }

  //flter out results to get the most first with 
  function checkPhotoWidth(arrayEl){
    if (arrayEl.photos){
      return parseInt(arrayEl.photos[0].width) >= 2000;
    }
  }

  function sendData(tripPhotoID) {
    var location = {
      fullLocation: autocompleteLocation
    };

    var newTrip = {
      name: tripName,
      location: location.fullLocation,
      startdate: startDate,
      enddate: endDate,
      UserId: userId,
      background_photo: tripPhotoID
    };
    $.ajax("/api/trip", {
      type: "POST",
      data: newTrip
    }).then(function () {
      console.log("new trip made");
      window.location.href = "/api/trip/dashboard";
    });
  }
});

var dateFormat = "mm/dd/yy",
  from = $("#from")
  .datepicker({
    defaultDate: "+1w",
    changeMonth: true,
    numberOfMonths: 3
  })
  .on("change", function () {
    to.datepicker("option", "minDate", getDate(this));
  }),
  to = $("#to")
  .datepicker({
    defaultDate: "+1w",
    changeMonth: true,
    numberOfMonths: 3
  })
  .on("change", function () {
    from.datepicker("option", "maxDate", getDate(this));
  });

function getDate(element) {
  var date;
  try {
    date = $.datepicker.parseDate(dateFormat, element.value);
  } catch (error) {
    date = null;
  }

  return date;
}

// Google's AutoComplete Feature
// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete;
var componentForm = {
  street_number: "short_name",
  route: "long_name",
  locality: "long_name",
  administrative_area_level_1: "short_name",
  country: "long_name",
  postal_code: "short_name"
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */
    (document.getElementById("autocomplete")), {
      types: ["geocode"]
    }
  );

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  // autocomplete.addListener("place_changed", fillInAddress);
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}