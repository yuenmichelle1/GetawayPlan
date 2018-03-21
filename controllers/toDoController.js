const db = require("../models");
const express = require("express");
const router = express.Router();
var isAuthenticated = require("../config/middleware/isAuthenticated");
// route 
// display User Trips (if any) Test on /members
router.get("/api/trip_data", function(req,res){
    db.Trip.findAll({}).then(function(trip){
        // grab most recent trip
        res.json(trip.reverse()[0]);
    })
});

// use this route when save new restaurant. Tested:working
router.post("/api/restaurant", function (req, res) {
    db.Restaurant.create(req.body).then(function (result) {
        res.json({
            id: result.id
        })
    })
})
// use this route when save new event.  Tested:working
router.post("/api/activity", function (req, res) {
    db.Activity.create(req.body).then(function (result) {
        res.json({
            id: result.id
        })
    })
})
// use this route when create new trip Tested:working
router.post("/api/trip", function (req, res) {
    db.Trip.create(req.body).then(function(result){
        res.json({
            id: result.id
        });
    })
})

// router.get('/api/trip/dashboard', isAuthenticated, function(req, res){
//     var userID = req.user.id;
//         console.log("userID:   " + userID)
//         db.Trip.findAll({
//             where: {
//                 UserId: userID
//             },
//             include: [{
//                     model: db.Restaurant,
//                     order: ["createdAt", "DESC"],
//                 },
//                 {
//                     model: db.Activity,
//                     order: ["createdAt", "DESC"],
//                 }
//             ]
//         }).then(function (trip) {
//             console.log(trip)
//             var tripData = trip[0].dataValues 

//             var resObj = {
//                     id: tripData.id,
//                     name: tripData.name,
//                     location: tripData.location,
//                     startDate: tripData.startdate,
//                     endData: tripData.enddate,
//                     // photo: trip.background_photo,
//                     restaurants: tripData.Restaurants,
//                     activities: tripData.Activities

//             };
//             console.log("handlbar object" + resObj)
//             res.render("index", resObj)
    
//         })
//     })

module.exports = router;