// Requiring necessary npm packages
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");
var app = express();

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Creating express app and configuring middleware needed for authentication

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static("public/"));
app.use(express.static(__dirname + '/public/'));
app.use(express.static("."));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/htmlroutes.js")(app);
require("./routes/apiRoutes.js")(app);

var toDoRoutes = require("./controllers/toDoController.js");
var userRoutes = require("./controllers/userController.js");
app.use(toDoRoutes);
app.use(userRoutes);

// Syncing our database ad logging a message to the user upon success
// { force: true }
db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, function() {
        console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});