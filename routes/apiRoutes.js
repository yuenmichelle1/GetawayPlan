var db = require("../models");
var passport = require("../config/passport");
var moment = require('moment');
var isAuthenticated = require("../config/middleware/isAuthenticated");
var path = require("path");


module.exports = function (app) {

    app.get("/api/trip/dashboard", isAuthenticated, function (req, res) {
        var userID = req.user.id;
        console.log("user ID: " + userID)
        db.Trip.findAll({
            where: {
                UserId: userID
            },
            order:[["createdAt", "DESC"], [db.Restaurant,"createdAt", "DESC"], [db.Activity, "createdAt", "DESC"]],
            include: [{
                    model: db.Restaurant,
                },
                {
                    model: db.Activity,
                }
            ]
        }).then(function (trip) {
            if (trip[0]){
                var tripData = trip[0].dataValues
                var resObj = {
                    id: tripData.id,
                    name: tripData.name,
                    location: tripData.location,
                    startDate: tripData.startdate,
                    endData: tripData.enddate,
                    photo: trip.background_photo,
                    restaurants: tripData.Restaurants,
                    activities: tripData.Activities
                };
                res.render("index", resObj)
            } else {
                res.redirect("/members")
                // res.sendFile(path.join(__dirname, "../public/members.html"));
            }
        })        
    })

        
    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        res.json("/api/trip/dashboard");
    });

    app.post("/api/signup", function (req, res) {
        db.User.create({
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            wantsTextNotification: req.body.wantsTextNotification
        }).then(function () {
            res.json("success");
        }).catch(function (err) {
            res.json(err);
        });
    });

    app.post("/api/restaurant", function (req, res) {
        db.Restaurant.create(req.body).then(function (result) {
            res.json({
                id: result.id
            })
        })
    })

    app.post("/api/activity", function (req, res) {
        db.Activity.create(req.body).then(function (result) {
            res.json({
                id: result.id
            })
        })
    })

    app.post("/api/trip", function (req, res) {
        db.Trip.create(req.body).then(function(result){
            res.json({
                id: result.id
            });
        })
    })

    app.get("/api/user_data", function(req, res) {

        if (!req.user) {
            res.json({});
            console.log("user logged off")
        } else {
            console.log("user is on")
            res.json({
                email: req.user.email,
                id: req.user.id
            });
        }
    });

    app.get("/api/trip_data", function(req,res){
        db.Trip.findAll({}).then(function(trip){
            res.json(trip.reverse()[0]);
        })
    });
    
};