$(function() {
    
$(".deleteActivity").on("click", function () {
        var id = $(this).data("id");
        console.log(id);
        console.log("click works");
        $.ajax({
            url: `/api/activity/${id}`,
            method: "DELETE"
        }).then(() => {
            location.reload();
            console.log("deleted");
        });
    });

    $(".deleteRestaurant").on("click", function () {
        var id = $(this).data("id");
        console.log(id);
        console.log("click works");
        $.ajax({
            url: `/api/restaurant/${id}`,
            method: "DELETE"
        }).then(() => {
            location.reload();
            console.log("deleted");
        });
    });
});