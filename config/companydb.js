var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var companySchema = mongoose.Schema({
    companyName: String,
    companyBudget: String,
    companyLocation: String,
    companyLogo: String,
    companySite: String,
    companyType: String,
    companyColor: String
});

module.exports = mongoose.model("companydata", companySchema);