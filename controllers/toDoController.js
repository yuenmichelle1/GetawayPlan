const db = require("../models");
const express = require("express");
const router = express.Router();

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
        })
    })
})

// use this route when transition to trip dashboard. Tested:working
// Send trip, activity. and restuarant information to index handlbars
router.get("/api/trip/:tripID", function (req, res) {
    console.log("req.params.tripID:  " + req.params.tripID)
    db.Trip.findAll({
        where: {
            id: req.params.tripID
        },
        include: [{
                model: db.Restaurant,
                order: ["createdAt", "DESC"],
            },
            {
                model: db.Activity,
                order: ["createdAt", "DESC"],
            }
        ]
    }).then(function (trip) {
        
        var tripData = trip[0]

        var resObj = Object.assign({}, {
                id: tripData.id,
                name: tripData.name,
                location: tripData.location,
                startDate: tripData.startdate,
                endData: tripData.enddate,
                // photo: trip.background_photo,
                restaurants: tripData.Restaurants,
                activities: tripData.Activities

        });
        console.log(resObj)
        res.render("index", resObj)
 
    })
})

module.exports = router;