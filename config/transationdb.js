var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var transationSchema = mongoose.Schema({
    userid: String,
    transitiondetail: Array,
});

module.exports = mongoose.model("transaction", transationSchema);