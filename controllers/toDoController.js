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

router.get("/api/trip/:tripID", function (req, res) {

    db.Trip.findAll({
        where: {
            id: req.params.tripID
        },
        include: db.Activity
    }).then(function (tripData) {
        res.json(tripData);
    })
})

// use this route when transition to trip dashboard. Send trip, activity, 
// and restuarant information to index handlbars
// router.get("/api/trip/:tripID", function (req, res) {
//     console.log("req.params.tripID:  " + req.params.tripID)
//     db.Trip.findAll({
//         where: {
//             id: req.params.tripID
//         },
//         include: [{
//                 model: db.Restaurant,
//                 order: ["createdAt", "DESC"],
//             },
//             {
//                 model: db.Activity,
//                 order: ["createdAt", "DESC"],
//             }
//         ]
//     }).then(function (tripData) {
//         console.log(tripData);
//         var resObj = tripData.map(trip => {
//             return Object.assign({}, {
//                 id: trip.id,
//                 name: trip.name,
//                 location: trip.location,
//                 dates: trip.dates,
//                 // photo: trip.background_photo,
//                 restaurants: trip.Restaurant.map(restaurant => {
//                     return Object.assign({}, {
//                         id: restaurant.id,
//                         name: restaurant.name,
//                         address: restaurant.address,
//                         rating: restaurant.rating,
//                         photo: restaurant.photo,
//                     })
//                 }),
//                 events: trip.Activity.map(activity => {
//                     return Object.assign({}, {
//                         id: activity.id,
//                         name: activity.name,
//                         photo: activity.photo,
//                         url: activity.url,
//                         description: activity.descriptio
//                     })
//                 })

//             })

//         });
//         console.log(resObj)
//         res.render("index", resObj)
//     })
// })

module.exports = router;