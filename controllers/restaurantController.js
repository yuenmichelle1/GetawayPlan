
const db = require("../models");
const express = require("express");
const router = express.Router();

router.post("/api/restaurant", function(req, res){
    db.Restaurant.create(req.body).then(function(result){
        res.json({
            id: result.id
        })
    })
})

router.post("/api/event", function(req, res){
    db.Event.create(req.body).then(function(result){
        res.json({
            id: result.id
        })
    })
})


router.get("/api/:tripID", function(req, res){
    db.Trip.findAll({
        where: {
            tripId: tripID
        },
        include:[
           {
                model: db.Restaurant,
                order:["createdAt","DESC"],
           },    
           {
                model: db.Event,
                order:["createdAt","DESC"],
           }
       ]
    }).then(function(tripData){
        console.log(tripData);
        var resObj = tripData.map(function(trip){
            return Object.assign({}, {
                trip_id: trip.id,
                trip_name: trip.name,
                trip_location: trip.location,
                

            })
            
        });


        

        res.render("index", {
            data: {
                restaurant:restaurantData,
                event:eventData
            }
        })
    })
})