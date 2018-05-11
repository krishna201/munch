var strictEqual = require('assert');

// the middleware function
module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1/munch');

    var conn = mongoose.connection;

    var model_schema_user = mongoose.Schema({ 
        mobile_number:String,
        password: String, 
        dob: String,
        gender:String,
        is_newsletter:Number,
        profile_status:Number, //1= register,2= otp verified,3= address
        is_otp_verified:{type: Number, default: 0},
        is_social:{type: Number, default: 0},//1=facebook,2=facebook
        social_login_status:{type:Number,default: 0},//1=first time, 2=login already
        otp:String
        
    }, {
        strict: false,
        collection: 'users'
        
    });
    var CollectionModel_user = conn.model('users', model_schema_user);

    var model_schema_restaurent = mongoose.Schema({ 
        mobile_number:String,
        password: String, 
        profile_status:Number, //1= register,2= otp verified,3= address
        is_otp_verified:{type: Number, default: 0},
        otp:String
        
    }, {
        strict: false,
        collection: 'restaurents'
        
    });
    var CollectionModel_restaurent = conn.model('restaurents', model_schema_restaurent);

    
    var model_schema_token = mongoose.Schema({
        user_id:String,
        token:String
    }, {
        
        strict: false,
        collection: 'tokens'
    });
    var CollectionModel_token = conn.model('tokens', model_schema_token);


    var model_schema_city_area = mongoose.Schema({
      city_name:String,
      areas:Array
    }, {
        
        strict: false,
        collection: 'city_area'
    });
    var CollectionModel_city_area = conn.model('city_area', model_schema_city_area);


   

    conn.on('error', function (err) {
        console.error(err);
        process.exit();
    })
    return function (req, res, next) {
        req.mongo = conn;
        req.Collection_user = CollectionModel_user;
        req.collection_restaurent = CollectionModel_restaurent;
        req.Collection_token = CollectionModel_token;
        req.Collection_city_area = CollectionModel_city_area;
        next();
    }

};
