$(function () {

    var tripAddress = "chicago"
    var geoApiKey;
    var queryURL_geo = `https://maps.googleapis.com/maps/api/geocode/json?address=${tripAddress}&key=${geoApiKey}`
            
    $.ajax({
        url: queryURL_geo,
        method: "GET"
    }).done(function (response) {
            var geo = response.results[0].geometry.location;
            var geoLocation = `${geo.lat},${geo.lng}`

            var getPhotoURLByReference = function(ref){
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
                        for (var i = 0; i < 3; i++) {
                    
                            var photoRef = result[i].photos[0].photo_reference;
                            var photoURL = getPhotoURLByReference(photoRef);
                            var restName = result[i].name;
                            var restRating = result[i].rating;
                            var restAddress = result[i].vicinity;

                            var newRow = $("<div class='row restaurant'>");
                            var newRestDiv = $("<div>").addClass("col-md-12")

                            var photo_col = $(`<img src=${photoURL}>`)
                            newRestDiv.append(restName, restRating, restAddress, photo_col)
                            $(".diningOptions").append(newRestDiv);


                        }
                    });



        });


    });