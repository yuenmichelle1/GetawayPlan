
var path = require("path");
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/home", function (req, res) {
    if (req.user) {
        res.redirect("/api/trip/dashboard");
    }
    console.log("logged out")
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// need to ask michelle about the id  -----------------------------------------------------------------
  app.get("/:id/trips/new/", function(req,res){
    res.sendFile(path.join(__dirname, "../public/tripForm.html"));
  })

// -----------------------------------------------------------------
// add route direct to food api
  app.get("/restaurants/new/", function(req,res){
    res.sendFile(path.join(__dirname, "../public/foodApi.html"));
  })


  app.get("/signup", function(req, res) {
    if (req.user) {
      res.redirect("/api/trip/dashboard");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    if (req.user) {
      res.redirect("/api/trip/dashboard");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

};