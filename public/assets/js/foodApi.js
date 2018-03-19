$(function () {
    //replace chicago with other info
    var tripAddress = "chicago";

    var queryURL_geo = `https://maps.googleapis.com/maps/api/geocode/json?address=${tripAddress}&key=${geoApiKey}`
    //comment out the return in the getPhotoURLByReference function to save api key usage when testing
    var getPhotoURLByReference = function (ref) {
        // return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${googlePlaceApiKey}`;
    };

    var addNewRestuarantRows = function (response) {
        var result = response.results;
        //change how many result to show. 20 max for one call. 60 max total (3 calls)
        for (var i = 0; i < 3; i++) {
            var photoRef = result[i].photos[0].photo_reference;
            var photoURL = getPhotoURLByReference(photoRef);
            var restInfo = {
                "data-restname": result[i].name,
                "data-restrating": `Rating: ${result[i].rating}/5`,
                "data-restaddress": result[i].vicinity,
                "data-photourl": photoURL
            }
            var newRestDiv = $("<div class='row restaurant'>");
            var photo_col = $("<div class='col-md-3'>")
            var info_col = $("<div class='col-md-3'>")
            var select_col = $("<div class='col-md-6'>")

            addInfoToCols(restInfo, photo_col, info_col);
            addSaveButton(restInfo, select_col)

            newRestDiv.append(photo_col, info_col, select_col)
            $(".diningOptions").append(newRestDiv);
        }
    }
    var addInfoToCols = function (restInfo, photo_col, info_col) {
        var restNameDiv = $("<h4>").text(restInfo["data-restname"]);
        var restAddressDiv = $("<p>").text(restInfo["data-restaddress"]);
        var restRatingDiv = $("<p>").text(restInfo["data-restrating"]);
        var imgDiv = $(`<img src=${restInfo["data-photourl"]} alt="restaurant-photo">`);
        photo_col.append(imgDiv);
        info_col.append(restNameDiv, restAddressDiv, restRatingDiv);

    }

    var addSaveButton = function (restInfo, select_col) {
        var button = $("<button class='btn-primary saveRestaurant'>").text("Save");
        button.attr(restInfo);
        select_col.append(button);
    }

    var addGetMoreBtn = function (btnClass) {
        var moreSuggestionButton = $(`<button class='btn-primary btn-block ${btnClass}'>`).text("Show me more");
        $(".diningOptions").append(moreSuggestionButton);
    }

    var saveRestaurant = function () {
        $(".diningOptions").on("click", ".saveRestaurant", function () {
            var info = {
                name: $(this).data("restname"),
                address: $(this).data("restaddress"),
                rating: $(this).data("restrating"),
                photo: $(this).data("photourl"),
                // replace :tripID with tripID variable
                tripID: 1      
            };
      
            $.post("/api/restaurant", info, function(){
                location.reload();
            })

        })
    }
    saveRestaurant();

    $.ajax({
        url: queryURL_geo,
        method: "GET"
    }).done(function (response) {
        var geo = response.results[0].geometry.location;
        var geoLocation = `${geo.lat},${geo.lng}`
        var queryURL_food = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${geoLocation}&radius=500&type=restaurant&rankby=prominence&key=${googlePlaceApiKey}`;
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