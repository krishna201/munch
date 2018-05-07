var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var adminSchema = mongoose.Schema({
    email: String,
    password: String
});

module.exports = mongoose.model("admin", adminSchema);