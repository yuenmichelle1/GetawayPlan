$(function () {
    $.get("/api/trip_data").then(function (data) {
        var tripAddress = data.location;
        var tripId = data.id;
        var geoApiKey = "AIzaSyBh7hRbHFAKc8vFy81Vp_OfiCY_X5gG-tk"
        //first key
        // var googlePlaceApiKey = "AIzaSyAEXm4PX5429L96nGX_Pc_eX6BP7rO2G84";
        // replacement key
        // var googlePlaceApiKey = "AIzaSyBK99ou2DEGTdr67L12tIAc0YGgPyCEuIg";
        //backup key
        var googlePlaceApiKey = "AIzaSyDlhX_mMtwzLxh19L43QpJEV41mRBCNP0k";
        var queryURL_geo = `https://maps.googleapis.com/maps/api/geocode/json?address=${tripAddress}&key=${geoApiKey}`
        //comment out the return in the getPhotoURLByReference function to save api key usage when testing
        var getPhotoURLByReference = function (ref) {
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${googlePlaceApiKey}`;
        };

        var addNewRestuarantRows = function (response) {
            var result = response.results;
            //change how many result to show. 20 max for one call. 60 max total (3 calls)

            for (var i = 0; i < 10; i++) {
                var photoRef = result[i].photos[0].photo_reference;
                var photoURL = getPhotoURLByReference(photoRef);

                var locationString = `${result[i].name}+${tripAddress}`;
                var mapQuery = locationString.replace(/,/g, "%2C").replace(/ /g, "+").replace(/\(|\)/g, "").replace(/º/g, "");

                var restInfo = {
                    "data-restname": result[i].name,
                    "data-restrating": result[i].rating,
                    "data-restaddress": result[i].vicinity,
                    "data-photourl": photoURL,

                    "data-restdirections": `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,

                    "data-state": 0,
                    "data-restaurantid": 0
                }
                var newRestDiv = $("<div class='row restaurant'>");
                var photo_col = $("<div class='col-md-3 rest-pic'>")
                var info_col = $("<div class='col-md-6 rest-info'>")
                var select_col = $("<div class='col-md-3 rest-btn'>")

                addInfoToCols(restInfo, photo_col, info_col);
                addSaveButton(restInfo, select_col)

                newRestDiv.append(photo_col, info_col, select_col)
                $(".diningOptions").append(newRestDiv);
            }
        }
        var addInfoToCols = function (restInfo, photo_col, info_col) {

            var restNameDiv = $("<h4 class='rest-name'>").text(restInfo["data-restname"]);
            var restAddressDiv = $("<h2 class='rest-address'>").text(restInfo["data-restaddress"]);
            var restRatingDiv = $("<h2 class='rest-rating'>").text(`Google Rating: ${restInfo["data-restrating"]}/5`);
            var mapUrlDiv = $(`<a class='rest-direction' target='_blank' href=${restInfo["data-restdirections"]}>Info & Directions</a>`);
            var imgDiv = $(`<img src=${restInfo["data-photourl"]} alt="restaurant-photo">`);
            photo_col.append(imgDiv);
            info_col.append(restNameDiv, restAddressDiv, restRatingDiv, mapUrlDiv);

        }

        var addSaveButton = function (restInfo, select_col) {
            var button = $("<button class='btn btn-warning my-2 my-sm-0 nav-btn saveRestaurant'>").text("+ Add To My Trip");
            button.attr(restInfo);
            select_col.append(button);
        }

        var addGetMoreBtn = function (btnClass) {
            var moreSuggestionButton = $(`<button class='btn btn-block btn-primary my-2 my-sm-0 nav-btn dashboard-btn more-btn ${btnClass}'>`).text("Show Me More");
            var moreSuggestionDiv = $("<div class='more-div'></div>").append(moreSuggestionButton);
            $(".diningOptions").append(moreSuggestionDiv);
        }

        var saveRestaurant = function () {
            $(".diningOptions").on("click", ".saveRestaurant", function () {
                var id;
                var btnstate = $(this).data("state");
                if (btnstate === 0) {
                    $(this).text("Saved To Your Trip");
                    $(this).css('background-color', '#0275d8');
                    $(this).css('border', '2px solid #0275d8');
                    $(this).css('border-color', '#0275d8');
                    $(this).data("state", 1);

                    var info = {
                        name: $(this).data("restname"),
                        address: $(this).data("restaddress"),
                        rating: $(this).data("restrating"),
                        photo: $(this).data("photourl"),
                        directions: $(this).data("restdirections"),
                        TripId: tripId
                    };

                    $.post("/api/restaurant", info, (result) => {
                        id = result.id;
                        $(this).data("restaurantid", id);
                    })
                } else {
                    $(this).text("+ Add To My Trip");
                    $(this).css('background-color', '');
                    $(this).css('border', '');
                    $(this).css('border-color', '');
                    $(this).data("state", 0);
                    var info = {
                        name: $(this).data("restname"),
                        address: $(this).data("restaddress"),
                        rating: $(this).data("restrating"),
                        photo: $(this).data("photourl"),
                        TripId: tripId
                    };
                    var id = $(this).data("restaurantid");
                    $.ajax({
                        url: `/api/restaurant/${id}`,
                        method: "DELETE"
                    }).then(() => {
                        console.log("deleted");
                    });
                }

            });
        }
        saveRestaurant();

        $.ajax({
            url: queryURL_geo,
            method: "GET"
        }).done(function (response) {
            var {
                lat,
                lng
            } = response.results[0].geometry.location;
            var queryURL_food = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&type=restaurant&rankby=prominence&key=${googlePlaceApiKey}`;
            $.ajax({
                url: queryURL_food,
                method: "GET"
            }).done(function (response) {
                var page2token = response.next_page_token;
                addNewRestuarantRows(response);
                addGetMoreBtn("getMoreBtn");

                $(".diningOptions").on("click", ".getMoreBtn", function () {
                    $.ajax({
                        url: `${queryURL_food}&pagetoken=${page2token}`,
                        method: "GET"
                    }).done(function (response) {
                        var page3token = response.next_page_token;
                        $(".getMoreBtn").remove();
                        addNewRestuarantRows(response);
                        addGetMoreBtn("getMoreBtn2");

                        $(".diningOptions").on("click", ".getMoreBtn2", function () {
                            $.ajax({
                                url: `${queryURL_food}&pagetoken=${page3token}`,
                                method: "GET"
                            }).done(function (response) {
                                console.log(response)
                                $(".getMoreBtn2").remove();
                                addNewRestuarantRows(response);
                            })
                        });
                    });

                })

            });
        });

    });
});