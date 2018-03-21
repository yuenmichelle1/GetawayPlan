var db = require("../models");
var passport = require("../config/passport");
var moment = require('moment');
var isAuthenticated = require("../config/middleware/isAuthenticated");


module.exports = function (app) {
    app.get("/", function (req, res) {
        if (req.user) {
            res.redirect("/api/trip/dashboard");
        }
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        res.json("/api/trip/dashboard");
      });

    app.get('/api/trip/dashboard', isAuthenticated, function (req, res) {
        var userID = req.user.id;

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
            var tripData = trip[0].dataValues

            var resObj = {
                id: tripData.id,
                name: tripData.name,
                location: tripData.location,
                startDate: tripData.startdate,
                endData: tripData.enddate,
                // photo: trip.background_photo,
                restaurants: tripData.Restaurants,
                activities: tripData.Activities

            };
            res.render("index", resObj)

        })
    })

    app.post("/api/signup", function (req, res) {
        console.log(req.body);
        db.User.create({
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            wantsTextNotification: req.body.wantsTextNotification
        }).then(function () {
            res.redirect(307, "/api/login");
        }).catch(function (err) {
            console.log(err);
            res.json(err);
        });
    });

    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });


    app.get("/api/user_data", function (req, res) {
        if (!req.user) {
            res.json({});
        } else {
            res.json({
                email: req.user.email,
                id: req.user.id
            });
        }
    });

    //trip routes
    app.get("/api/trip_data", function(req,res){
        db.Trip.findAll({}).then(function(trip){
            // grab most recent trip
            res.json(trip.reverse()[0]);
        })
    });
    
    // use this route when save new restaurant. Tested:working
    app.post("/api/restaurant", function (req, res) {
        db.Restaurant.create(req.body).then(function (result) {
            res.json({
                id: result.id
            })
        })
    })
    // use this route when save new event.  Tested:working
    app.post("/api/activity", function (req, res) {
        db.Activity.create(req.body).then(function (result) {
            res.json({
                id: result.id
            })
        })
    })
    // use this route when create new trip Tested:working
    app.post("/api/trip", function (req, res) {
        db.Trip.create(req.body).then(function(result){
            res.json({
                id: result.id
            });
        })
    })
    

};