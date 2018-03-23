$(function () {
    $.get("/api/trip_data").then(function (data) {
        var tripAddress = data.location;
        var tripId = data.id;
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
                    "data-state": 0,
                    "data-activityid": 0
                }
                var newActDiv = $("<div class='row activity'>");
                var photo_col = $("<div class='col-md-3 poi-pic'>");
                var info_col = $("<div class='col-md-6 poi-info'>");
                var select_col = $("<div class='col-md-3 poi-btn'>");

                addInfoToCols(activityInfo, photo_col, info_col);
                addSaveButton(activityInfo, select_col)

                newActDiv.append(photo_col, info_col, select_col)
                $(".activityOptions").append(newActDiv);
            }
        }
        var addInfoToCols = function (activityInfo, photo_col, info_col) {
            var imgDiv = $(`<a href=${activityInfo["data-activityurl"]}><img src=${activityInfo["data-activityphoto"]} alt="activity-photo">`);
            var actNameDiv = $("<h4 class='poi-name'>").text(activityInfo["data-activityname"]);
            var actDescDiv = $("<p class='poi-description'>").text(activityInfo["data-activitydescription"]);
            var mapUrlDiv = $(`<a class='poi-direction' href=${activityInfo["data-activitydirections"]}>Get Directions</a>`);
            photo_col.append(imgDiv);
            info_col.append(actNameDiv, actDescDiv, mapUrlDiv);
        }

        var addSaveButton = function (activityInfo, select_col) {
            var button = $("<button class='btn btn-warning my-2 my-sm-0 nav-btn saveRestaurant saveActivity'>").text("+ Add To My Trip");
            // why setting attribute on button to activity object property:values?
            button.attr(activityInfo);
            select_col.append(button);
        }

        var saveActivity = function () {
            $(".activityOptions").on("click", ".saveActivity", function () {
                var id;
                var btnstate = $(this).data("state");
                if (btnstate === 0) {
                    $(this).text("Saved To Your Trip");
                    $(this).css('background-color', '#0275d8');
                    $(this).css('border', '2px solid #0275d8');
                    $(this).css('border-color', '#0275d8');
                    $(this).data("state", 1);
                    var info = {
                        name: $(this).data("activityname"),
                        photo: $(this).data("activityphoto"),
                        url: $(this).data("activityurl"),
                        description: $(this).data("activitydescription"),
                        directions: $(this).data("activitydirections"),
                        TripId: tripId
                    };
                    $.post("/api/activity", info, (result) => {
                        id = result.id;
                        $(this).data("activityid", id);
                    })

                } else {
                    $(this).text("SAVE");
                    $(this).data("state", 0);
                    var info = {
                        name: $(this).data("activityname"),
                        photo: $(this).data("activityphoto"),
                        url: $(this).data("activityurl"),
                        description: $(this).data("activitydescription"),
                        directions: $(this).data("activitydirections"),
                        TripId: tripId
                    };
                    var id = $(this).data("activityid");
                    $.ajax({
                        url: `/api/activity/${id}`,
                        method: "DELETE"
                    }).then(() => {
                        console.log("deleted");
                    });
                }

            });
        }
        saveActivity();

        $.ajax({
            url: queryURL_geo,
            method: "GET"
        }).done(function (response) {
            var {
                lat,
                lng
            } = response.results[0].geometry.location;
            var query = `https://api.sygictravelapi.com/1.0/en/places/list?location=${lat},${lng}&level=poi&limit=20`;

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