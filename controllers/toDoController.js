const db = require("../models");
const express = require("express");
const router = express.Router();

// use this route when save new restaurant
router.post("/api/restaurant", function (req, res) {
    db.Restaurant.create(req.body).then(function (result) {
        res.json({
            id: result.id
        })
    })
})
// use this route when save new event
router.post("/api/events", function (req, res) {
    db.Event.create(req.body).then(function (result) {
        res.json({
            id: result.id
        })
    })
})
// use this route when create new trip
router.post("/api/trip", function (req, res) {
    db.Trip.create(req.body).then(function(result){
        res.json({
            id: result.id
        })
    })
})
// use this route when transition to trip dashboard. Send trip, activity, 
// and restuarant information to index handlbars
router.get("/api/:tripID", function (req, res) {
    db.Trip.findAll({
        where: {
            tripId: tripID
        },
        include: [{
                model: db.Restaurant,
                order: ["createdAt", "DESC"],
            },
            {
                model: db.Events,
                order: ["createdAt", "DESC"],
            }
        ]
    }).then(function (tripData) {
        console.log(tripData);
        var resObj = tripData.map(trip => {
            return Object.assign({}, {
                id: trip.id,
                name: trip.name,
                location: trip.location,
                dates: trip.dates,
                photo: trip.background_photo,
                restaurants: trip.Restaurant.map(restaurant => {
                    return Object.assign({}, {
                        id: restaurant.id,
                        name: restaurant.name,
                        address: restaurant.address,
                        rating: restaurant.rating,
                        photo: restaurant.photo,
                    })
                }),
                events: trip.Events.map(event => {
                    return Object.assign({}, {
                        id: event.id,
                        name: event.name,
                        address: event.address,
                        rating: event.rating,
                        photo: event.photo
                    })
                })

            })

        });
        console.log(resObj)
        res.render("index", resObj)
    })
})

module.exports = router;