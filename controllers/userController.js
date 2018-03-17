var express = require("express");
var router = express.Router();
var db = require("../models");

// get route -> index

// post route -> back to index
router.post("/api/signup", function(req, res) {
  // takes the request object using it as input for buger.addBurger
  db.User.create(req.body).then(function(result) {
    // wrapper for orm.js that using MySQL insert callback will return a log to console,
    // render back to index with handle
    console.log(result);
    res.redirect(307, "/api/login");
  });
  console.log(req.body);
});

// put route -> back to index

// module.exports = router;
