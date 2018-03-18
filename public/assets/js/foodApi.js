$(function () {
    //replace chicago with other info
    var tripAddress = "chicago"
    var geoApiKey;
    var queryURL_geo = `https://maps.googleapis.com/maps/api/geocode/json?address=${tripAddress}&key=${geoApiKey}`

    $.ajax({
        url: queryURL_geo,
        method: "GET"
    }).done(function (response) {
        var geo = response.results[0].geometry.location;
        var geoLocation = `${geo.lat},${geo.lng}`

        var getPhotoURLByReference = function (ref) {
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${googlePlaceApiKey}`;
        };
        var corsfix = "https://cors-anywhere.herokuapp.com/";
        var googlePlaceApiKey;
        var type = "restaurant";
        var queryURL_food = `${corsfix}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${geoLocation}&radius=500&type=${type}&rankby=prominence&key=${googlePlaceApiKey}`;

        $.ajax({
            url: queryURL_food,
            method: "GET"
        }).done(function (response) {
            var result = response.results;

            console.log(result)
            for (var i = 0; i < 1; i++) {

                var photoRef = result[i].photos[0].photo_reference;
                var photoURL = getPhotoURLByReference(photoRef);

                var restInfo = {
                    "data-restname": result[i].name,
                    "data-restrating": `Rating: ${result[i].rating}/5`,
                    "data-restaddress":result[i].vicinity,
                    "data-photourl": photoURL
                }

                var newRestDiv = $("<div class='row restaurant'>");
                var restNameDiv = $("<h4>").text(restInfo["data-restname"]);
                var restAddressDiv = $("<p>").text(restInfo["data-restaddress"]);
                var restRatingDiv = $("<p>").text(restInfo["data-restrating"]);
                var imgDiv = $(`<img src=${restInfo["data-photourl"]}>`);
                var button = $("<button class='btn-primary saveRestaurant'>").text("Save");

                var photo_col = $("<div>").addClass("col-md-3")
                var info_col = $("<div>").addClass("col-md-3")
                var select_col = $("<div>").addClass("col-md-6")

                button.attr(restInfo);

                photo_col.append(imgDiv);
                info_col.append(restNameDiv, restAddressDiv, restRatingDiv);
    
                select_col.append(button);
                newRestDiv.append(photo_col, info_col, select_col)
                $(".diningOptions").append(newRestDiv);

            }

            var moreSuggestionButton = $("<button class='btn-primary btn-block'>").text("Show me more");
            $(".diningOptions").append(moreSuggestionButton);
        });

        $(".diningOptions").on("click", "button", function(){
            var info = $(this).data("restname");
            console.log("clicked"+info)
        })


    });
});