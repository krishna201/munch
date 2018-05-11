/*
 * @Author: Krishna 
 * @Date: 2018-04-20 15:34:58 
 * @Last Modified by: Krishna
 * @Last Modified time: 2018-04-20 17:00:53
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var restSchema = mongoose.Schema({
    restTitle:{type:String},
    Wallet:{type:Number},
    rating:{type:Number},
    minOrder:{type:Number},
    deliveryCharge:{type:Number},
    address:{type:String},// doubt
    info:{type:String}, //doubt
    offer:{type:String},
    menu:{type:Array}

});

module.exports = mongoose.model("restaurantdata", restSchema);