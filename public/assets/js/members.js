$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });
  $("#createTrip").on("click", function(){
    // $.get("/trips/new").then(function(pageContent){
    //   $("html").html(pageContent);
    // })
    window.location.href = "/trips/new";
    return false;
  })
});
