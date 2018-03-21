 $.get("/api/user_data").then(function(data){
	return userId= data.id;	
})

$("#createNewTrip").on("click", function() {
    //
    var autocompleteLocation = $("#autocomplete").val();
    var locationCity = $("#locality").val();
    var locationState = $("#administrative_area_level_1").val();
    var locationCountry = $("#country").val();
    var zipCode = $("#postal_code").val();
    var startDate = $("#from").val();
    var endDate = $("#to").val();
    var tripName = $("#tripName").val().trim();

    checkDataFilled();

    function checkDataFilled() {
        if (autocompleteLocation === "" || locationCity === "") {
            // replace with modal later
            alert("Enter Address");
        } else if (endDate === "" || startDate === "") {
            // replace with modal later
            alert("Enter Dates");
        } else {
            sendData();
        }
    }

    function sendData() {
        var location = {
            fullLocation: autocompleteLocation,
            city: locationCity,
            state: locationState,
            zipCode: zipCode
        };

        var newTrip = {
            name: tripName,
            location: location.fullLocation,
            startdate: startDate,
            enddate: endDate,
            UserId: userId
        };
        $.ajax("/api/trip", {
            type: "POST",
            data: newTrip
        }).then(function(data) {
            console.log("new trip made");
            // window.location.href = `/api/trip/${data.id}`;
            window.location.href=`/members`;
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
    .on("change", function() {
        to.datepicker("option", "minDate", getDate(this));
    }),
    to = $("#to")
    .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3
    })
    .on("change", function() {
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

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
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
    autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    for (var component in componentForm) {
        document.getElementById(component).value = "";
        document.getElementById(component).disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
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