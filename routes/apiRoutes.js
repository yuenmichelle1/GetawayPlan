var db = require("../models");
var passport = require("../config/passport");
var moment = require('moment');
var isAuthenticated = require("../config/middleware/isAuthenticated");


module.exports = function(app) {
    app.get("/", function(req, res) {
        // If the user already has an account send them to the members page
        if (req.user) {
          res.redirect("/members");
        }
        res.sendFile(path.join(__dirname, "../public/index.html"));
      });
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the dashboard page.
    // Otherwise the user will stay in login

    // app.post('/api/login', passport.authenticate('local'), function(req, res) {
    //   res.redirect('/');
    // });

    // app.post('/api/login', passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login' }));
  
    app.post('/api/login', passport.authenticate('local'), function(req, res) {
        res.redirect(`/api/trip/dashboard`);
      });

    app.get('/api/trip/dashboard', isAuthenticated, function(req, res){
        var userID = req.user.id;
            console.log("userID:   " + userID)
            db.Trip.findAll({
                where: {
                    UserId: userID
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
                console.log(trip)
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
                console.log("handlbar object" + resObj)
                res.render("index", resObj)
        
            })
        })
    
    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    // POST USER
    app.post("/api/signup", function(req, res) {
        console.log(req.body);
        db.User.create({
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            wantsTextNotification: req.body.wantsTextNotification
        }).then(function() {
            res.redirect(307, "/api/login");
        }).catch(function(err) {
            console.log(err);
            res.json(err);
            // res.status(422).json(err.errors[0].message);
        });
    });

    // Route for logging user out
    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", function(req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            res.json({
                email: req.user.email,
                id: req.user.id
            });
        }
    });

};