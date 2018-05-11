const express = require("express");
const router = express.Router();

var msg = require("../../constant/message");
var status = require("../../constant/status")
var jwt = require('jsonwebtoken');

router.get("/", function (req, res) {
    res.json("user");
})


// user registration
router.post("/manual_registration", function (req, res) {
    console.log(req.body);
    var mobile_number = req.body.mobile_number;
    var password = req.body.password;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var is_newsletter = req.body.is_newsletter;
    var users = req.Collection_user;

    if (typeof mobile_number === "undefined" || !mobile_number || typeof password === "undefined" || !password || typeof gender === "undefined" || !gender || typeof is_newsletter === "undefined" || !is_newsletter || typeof dob === "undefined" || !dob) {

        res.status(status.PARAMETER_MISSING_STATUS).json({
            message: msg.PARAMETER_MISSING_MESSAGE
        })
    } else {

        var newuser = new users({
            mobile_number: mobile_number,
            password: password,
            gender: gender,
            dob: dob,
            is_newsletter: is_newsletter,
            profile_status: "1",
            otp: "0000"
        })
        users.find({ mobile_number: mobile_number }).exec(function (err, velidationResult) {
            if (err) {
                res.status(status.ERROR_IN_EXECUTION).json({ message: err })

            } else {
                if (velidationResult.length == 0) {
                    newuser.save(function (err, result) {
                        if (err) {
                            res.status(status.ERROR_IN_EXECUTION).json({ message: err })
                        } else {
                            res.status(status.SUCCESS_STATUS).json({ response: result, message: msg.SUCCESS_MESSAGE })
                            // res.json(result);
                        }

                    })

                } else {

                    res.status(status.ALREADY_EXIST).json({ message: msg.USER_EXIST })
                }
            }

        })


    }

});
///===========OTP verification===================================================================

router.post("/otp_verification", function (req, res) {
    console.log(req.body);
    var user_id = req.body.user_id
    var mobile_number = req.body.mobile_number;
    var otp = req.body.otp;
    var users = req.Collection_user;

    if (typeof mobile_number === "undefined" || !mobile_number || typeof user_id === "undefined" || !user_id || typeof otp === "undefined" || !otp) {

        res.status(status.PARAMETER_MISSING_STATUS).json({
            message: msg.PARAMETER_MISSING_MESSAGE
        })
    } else {
        users.findOne({ _id: user_id }).exec(function (err, verifiedResult) {
            console.log(verifiedResult);

            if (verifiedResult.mobile_number == mobile_number) {
                if (verifiedResult.otp == otp) {
                    users.update({ _id: user_id }, { is_otp_verified: 1, profile_status: 2 }, function (err, otpupdateResult) {
                        if (err) {
                            res.status(status.ERROR_IN_EXECUTION).json({ message: err })
                        } else {
                            res.status(status.SUCCESS_STATUS).json({ message: msg.OTP_MATCHED })
                        }
                    })

                } else {
                    res.status(status.INVALID_CREDENTIAL).json({ message: msg.INVALID_VERIFICATION_CODE })

                }
            } else {
                res.status(status.INVALID_CREDENTIAL).json({
                    message: msg.INVALID_MOBILE_NUMBER
                })

            }
        })

    }

})

/// resend otp 

router.post("/resend_otp", function (req, res) {
console.log(req.body);
    var user_id = req.body.user_id
    var mobile_number = req.body.mobile_number;
    var users = req.Collection_user;

    if (typeof mobile_number === "undefined" || !mobile_number || typeof user_id === "undefined" || !user_id) {

        res.status(status.PARAMETER_MISSING_STATUS).json({
            message: msg.PARAMETER_MISSING_MESSAGE
        })
    } else {
        users.findOne({ _id: user_id }).exec(function (err, resendotpResult) {
            console.log(err);
            if (err) {
                res.status(status.ERROR_IN_EXECUTION).json({ message: err })
            } else {
                if (resendotpResult.mobile_number == mobile_number) {
                    users.update({ _id: user_id }, { otp: "0000" }, function (err, otpupdateResult) {
                        if (err) {
                            res.status(status.ERROR_IN_EXECUTION).json({ message: err })
                        } else {
                            res.status(status.SUCCESS_STATUS).json({ message: msg.OTP_SENT })
                        }
                    })
                } else {
                    res.status(status.INVALID_CREDENTIAL).json({
                        message: msg.INVALID_MOBILE_NUMBER
                    })
                }

            }

        })

    }

})


//// user login 
//========================================================

router.post("/login", function (req, res) {
    console.log(req.body);
    var mobile_number = req.body.mobile_number;
    var password = req.body.password;
    var users = req.Collection_user;
    var token = req.Collection_token;
    if (typeof mobile_number === "undefined" || !mobile_number || typeof password === "undefined" || !password) {

        res.status(status.PARAMETER_MISSING_STATUS).json({
            message: msg.PARAMETER_MISSING_MESSAGE
        })
    } else {

        users.findOne({ mobile_number: mobile_number }).exec(function (err, loginstatusResult) {
            if (err) {
                res.status(status.ERROR_IN_EXECUTION).json({ message: err })
            } else {
                if (loginstatusResult.socialLoginStatus > 0) {
                    res.status(status.BAD_REQUEST_STATUS).json({
                        response: loginstatusResult,
                        message: "already login with social"
                    })
                } else {
                    if (loginstatusResult.mobile_number == mobile_number) {

                        if (loginstatusResult.password == password) {
                            var usertoken = jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // expiring in 24 hrs
                                id: loginstatusResult._id,
                                date: Date.now() / 1000
                            }, 'secret');
                            token.find({ user_id: loginstatusResult._id }).exec(function (err, tokenResult) {
                                if (err) {
                                    res.status(status.ERROR_IN_EXECUTION).json({ message: err })
                                } else {
                                    if (tokenResult.length == 0) {
                                        var record = new token({
                                            user_id: loginstatusResult._id,
                                            token: usertoken
                                        });
                                        record.save(function (err, recordResult) {
                                            if (err) {
                                                res.status(status.ERROR_IN_EXECUTION).json({ message: err })
                                            } else {
                                                res.status(status.SUCCESS_STATUS).json({ response: loginstatusResult, message: msg.SUCCESS_MESSAGE })
                                            }

                                        })
                                    } else {
                                        token.update({ user_id: loginstatusResult._id }, { token: usertoken }, function (err, otpupdateResult) {
                                            if (err) {
                                                res.status(status.ERROR_IN_EXECUTION).json({ message: err })
                                            } else {
                                                res.status(status.SUCCESS_STATUS).json({ response: loginstatusResult, message: msg.SUCCESS_MESSAGE })
                                            }
                                        })

                                    }
                                }
                            })
                        } else {
                            res.status(status.INVALID_CREDENTIAL).json({
                                message: msg.INVALID_LOGIN_MESSAGE
                            })

                        }
                    } else {
                        res.status(status.INVALID_CREDENTIAL).json({
                            message: msg.INVALID_MOBILE_NUMBER
                        })

                    }
                }



            }
        })
    }

})

////==== user logout 

router.post("/logout", function (req, res) {
    var userId = req.body.userId;
    var token = req.Collection_token;
    if (typeof userId === "undefined" || !userId) {

        res.status(status.PARAMETER_MISSING_STATUS).json({
            message: msg.PARAMETER_MISSING_MESSAGE
        })
    } else {
        token.update({ userId: userId }, { token: "" }).exec(function (err, logoutResult) {
            if (err) {
                res.status(status.ERROR_IN_EXECUTION).json({ message: err })
            } else {
                res.status(status.SUCCESS_STATUS).json({ message: msg.USER_LOGOUT_MESSAGE })

            }
        })

    }

})

/// inserting city and area

router.post("/inser_city_and_area",function(req,res){
    var city_name = req.body.city_name;
    var area_name = req.body.area_name;
    var postal_code = req.body.postal_code;
    var cityArea = req.Collection_city_area;

    if (typeof city_name === "undefined" || !city_name || typeof area_name === "undefined" || !area_name || typeof postal_code === "undefined" || !postal_code) {

        res.status(status.PARAMETER_MISSING_STATUS).json({
            message: msg.PARAMETER_MISSING_MESSAGE
        })
    } else {
        cityArea.find({city_name:city_name}).exec(function(err,cityResult){
            if (err) {
                res.status(status.ERROR_IN_EXECUTION).json({ message: err })
            } else {
               if(cityResult.length > 0){
                var area1 = {
                    area_name:area_name,
                    postal_code:postal_code,
                    area_id :Date.now()
                }
                user.updateOne({ city_name: cityResult.city_name }, {
                    $push: {
                       area:area1
                    }
                }, function(err, updateResult) {})

               } else {
                   var area1 = {
                       area_name:area_name,
                       postal_code:postal_code,
                       area_id :Date.now()
                   }
                   var newCity = new cityArea({
                       city_name:city_name,
                       area:area1
                   })
                   newCity.save(function(err,saveResult){
                    if (err) {
                        res.status(status.ERROR_IN_EXECUTION).json({ message: err })
                    } else {}
                   })
               }

            }
        })
       
    }

})


module.exports = router;