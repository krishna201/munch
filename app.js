
/**
 * Module dependencies.
 */
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");
var morgan = require("morgan");
var fileUpload = require("express-fileupload");
var path = require("path");
var cors = require("cors");


var ip = require("ip");
var port = process.env.PORT || 8080;

var app = express();

var db = require('./config/db.js');
//configuration middleware//

app.use(express.static(__dirname + "/public"));
// app.use(
//     fileUpload({
//         limits: { fileSize: 50 * 1024 * 1024 }
//         // safeFileNames: true,
//         // preserveExtension: true
//     })
// );
app.use(fileUpload());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json());
app.use(db());
app.use(methodOverride());
app.use("/", express.static(__dirname + "/uploads"));


//=========router==========================================================================
//// users router------------------------


var user = require("./routes/user/user");
app.use("/user",user);
var restaurent = require("./routes/restaurent/restaurent");
app.use("/restaurent",restaurent);








///server creation

var ipaddress = ip.address();
app.listen(port);

console.log("server in running on", ipaddress + ":" + port);
console.log("The App runs on port " + port);