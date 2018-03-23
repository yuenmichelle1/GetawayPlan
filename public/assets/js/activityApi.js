// route from Dashboard does not work...needs to change to just pois/new vs api/trips/pois/new = error
// get travelinput variable from form into js for my code and restaurant
// post route works !!
// 

$(function () {

    // get tripAddress from the form user submits for trip
    // var tripAddress = $("#autocomplete").val();
    var tripAddress = "Chicago, IL";
    var geoApiKey = "AIzaSyBh7hRbHFAKc8vFy81Vp_OfiCY_X5gG-tk";
    var queryURL_geo = `https://maps.googleapis.com/maps/api/geocode/json?address=${tripAddress}&key=${geoApiKey}`;

    var addNewActivityRows = function (response) {
        var result = response.data.places;

        for (var i = 0; i < result.length; i++) {

            var locationString = `${result[i].name}+${tripAddress}`;
            var mapQuery = locationString.replace(/,/g, "%2C").replace(/ /g, "+").replace(/\(|\)/g, "").replace(/º/g, "");
            var activityInfo = {
                "data-activityname": result[i].name,
                "data-activityphoto": result[i].thumbnail_url,
                "data-activityurl": result[i].url,
                "data-activitydescription": result[i].perex,
                "data-activitydirections": `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
                "data-state": 0
            }
            var newActDiv = $("<div class='row activity'>");
            var photo_col = $("<div class='col-md-3'>");
            var info_col = $("<div class='col-md-6'>");
            var select_col = $("<div class='col-md-3'>");

            addInfoToCols(activityInfo, photo_col, info_col);
            addSaveButton(activityInfo, select_col)

            newActDiv.append(photo_col, info_col, select_col)
            $(".activityOptions").append(newActDiv);
        }
    }
    var addInfoToCols = function (activityInfo, photo_col, info_col) {
        var imgDiv = $(`<a href=${activityInfo["data-activityurl"]}><img src=${activityInfo["data-activityphoto"]} alt="activity-photo">`);
        var actNameDiv = $("<h4>").text(activityInfo["data-activityname"]);
        var actDescDiv = $("<p>").text(activityInfo["data-activitydescription"]);
        var mapUrlDiv = $(`<a href=${activityInfo["data-activitydirections"]}>Directions</a>`);
        photo_col.append(imgDiv);
        info_col.append(actNameDiv, actDescDiv, mapUrlDiv);
    }

    var addSaveButton = function (activityInfo, select_col) {
        var button = $("<button class='btn-primary saveActivity'>").text("SAVE");
        // why setting attribute on button to activity object property:values?
        button.attr(activityInfo);
        select_col.append(button);
    }

    var saveActivity = function () {
        $(".activityOptions").on("click", ".saveActivity", function () {
            btnstate = $(this).data("state");
            if (btnstate === 0) {
                $(this).text("SAVED");
                $(this).data("state", 1);
                console.log($(this).data("state"));
                var info = {
                    name: $(this).data("activityname"),
                    photo: $(this).data("activityphoto"),
                    url: $(this).data("activityurl"),
                    description: $(this).data("activitydescription"),
                    directions: $(this).data("activitydirections"),
                    state: 1,
                    tripID: 1
                };

                console.log(info);
                $.post("/api/activity", info, function () {
                });
                console.log("after");

            } else {
                $(this).text("SAVE");
                $(this).data("state", 0);
                console.log($(this).data("state"));
                var info = {
                    name: $(this).data("activityname"),
                    photo: $(this).data("activityphoto"),
                    url: $(this).data("activityurl"),
                    description: $(this).data("activitydescription"),
                    directions: $(this).data("activitydirections"),
                    state: 0,
                    tripID: 1
                };
                
                console.log(info);
                $.delete("/api/activity/", info, function () {
                    // location.reload();
                    console.log("delete is running...");
                })
            }

        });
    }
    saveActivity();

    $.ajax({
        url: queryURL_geo,
        method: "GET"
    }).done(function (response) {
        var {lat, lng} = response.results[0].geometry.location;
        // var geoLocation = `${geo.lat},${geo.lng}`

    //   coordinates need to come from the geo api call
    var query = `https://api.sygictravelapi.com/1.0/en/places/list?location=${lat},${lng}&level=poi&limit=20`;
    $("#search").on("click", function () {
        $.ajax({
            url: query,
            method: "GET",
            headers: {
                "x-api-key": "Cy0Gz9HmVx1Kn9OL5U5TZ7ecFuoUigxY2kEH4God"
            }
        }).done(function (response) {
            addNewActivityRows(response);
        });
    });
});
});