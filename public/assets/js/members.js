$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  var userId;
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    userId = data.id;
  });
  $("#createTrip").on("click", function(){
    window.location.href = `/${userId}/trips/new`;
  })
});
