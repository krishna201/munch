var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var userSchema = mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    emailId:{type:String},
    mobileNo:{type:String,required: true,unique: true},
    password: {type:String, required: true},
    userWallet:{type:Number,default: 0},
    gender:{
        type: String,
        enum: ["male", "female"]
    },
    userProfile:{type:String},
    favouriteRes:Array,
    dob:String,
    address:{type:Array}, //doubt
    refcode:{type:String},
    totalRefcode:Array,
    notificationContent:Array,
    pushNotification:{type:Number,default:1},
    pushId: String,
    userStatus:{type: String, default: "0"},
    facebookAccessId:String,
    googleAccessId:String,
    otp:{type: String},
    isNewsletter:{type:String}, //0 or 1
    termCondition:{type:String},
    date:{type:String, default:Date.now()}
});

mongoose.connect("mongodb://localhost:27017/munchdb", function(err) {
    if (err) {
        console.log("err",err.message);
    } else {
        console.log("Connected to the munch database");
    }
});

module.exports = mongoose.model("munchUsers", userSchema);