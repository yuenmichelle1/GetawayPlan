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

// router.get("/api/trip/:tripID", function (req, res) {

//     db.Trip.findAll({
//         where: {
//             id: req.params.tripID
//         },
//         include: db.Activity
//     }).then(function (tripData) {
//         res.json(tripData);
//     })
// })

// use this route when transition to trip dashboard. Send trip, activity, 
// and restuarant information to index handlbars
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

// [
//     {
//         "id": 1,
//         "name": "new york trip",
//         "location": "new york",
//         "startdate": "2018-02-12",
//         "enddate": "2018-02-28",
//         "createdAt": "2018-03-20T03:47:17.000Z",
//         "updatedAt": "2018-03-20T03:47:17.000Z",
//         "Restaurants": [
//             {
//                 "id": 9,
//                 "name": "restname8",
//                 "address": "3003 chicago street",
//                 "rating": 3,
//                 "photo": "https://www.google.com/search?q=google+translate&oq=ggo&aqs=chrome.1.69i57j0l5.4110j1j7&sourceid=chrome&ie=UTF-8",
//                 "createdAt": "2018-03-20T03:50:01.000Z",
//                 "updatedAt": "2018-03-20T03:50:01.000Z",
//                 "TripId": 1
//             }
//         ],
//         "Activities": [
//             {
//                 "id": 2,
//                 "name": "activity-1",
//                 "photo": "https://www.google.com/search?q=google+translate&oq=ggo&aqs=chrome.1.69i57j0l5.4110j1j7&sourceid=chrome&ie=UTF-8",
//                 "url": "https://www.google.com/search?q=google+translate&oq=ggo&aqs=chrome.1.69i57j0l5.4110j1j7&sourceid=chrome&ie=UTF-8",
//                 "description": "amy found an awesome api and panda expresss",
//                 "createdAt": "2018-03-20T03:51:00.000Z",
//                 "updatedAt": "2018-03-20T03:51:00.000Z",
//                 "TripId": 1
//             },
//             {
//                 "id": 3,
//                 "name": "activity-2",
//                 "photo": "https://www.google.com/search?q=google+translate&oq=ggo&aqs=chrome.1.69i57j0l5.4110j1j7&sourceid=chrome&ie=UTF-8",
//                 "url": "https://www.google.com/search?q=google+translate&oq=ggo&aqs=chrome.1.69i57j0l5.4110j1j7&sourceid=chrome&ie=UTF-8",
//                 "description": "amy found an awesome api and panda expresss",
//                 "createdAt": "2018-03-20T03:51:03.000Z",
//                 "updatedAt": "2018-03-20T03:51:03.000Z",
//                 "TripId": 1
//             }
//         ]
//     }
// ]