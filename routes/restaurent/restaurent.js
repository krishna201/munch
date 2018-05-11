const express = require("express");
const router = express.Router();

var msg = require("../../constant/message");
var status = require("../../constant/status")
var jwt = require('jsonwebtoken');
router.get("/", function (req, res) {
    res.json("restaurent");
})

/// restaurent signup
router.post("/manual_registration", function (req, res) {
    console.log(req.body);
    var mobile_number = req.body.mobile_number;
    var password = req.body.password;
   
    var restaurent = req.collection_restaurent;

    if (typeof mobile_number === "undefined" || !mobile_number || typeof password === "undefined" || !password  ) {

        res.status(status.PARAMETER_MISSING_STATUS).json({
            message: msg.PARAMETER_MISSING_MESSAGE
        })
    } else {

        var newrestaurent = new restaurent({
            mobile_number: mobile_number,
            password: password,
            profile_status: "1",
            otp: "0000"
        })
        restaurent.find({ mobile_number: mobile_number }).exec(function (err, velidationResult) {
            if (err) {
                res.status(status.ERROR_IN_EXECUTION).json({ message: err })

            } else {
                if (velidationResult.length == 0) {
                    newrestaurent.save(function (err, result) {
                        if (err) {
                            res.status(status.ERROR_IN_EXECUTION).json({ message: err })
                        } else {
                            res.status(status.SUCCESS_STATUS).json({ response: result, message: msg.SUCCESS_MESSAGE })
                        
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
    var user_id = req.body.user_id
    var mobile_number = req.body.mobile_number;
    var otp = req.body.otp;
    var restaurent = req.collection_restaurent;

    if (typeof mobile_number === "undefined" || !mobile_number || typeof user_id === "undefined" || !user_id || typeof otp === "undefined" || !otp) {

        res.status(status.PARAMETER_MISSING_STATUS).json({
            message: msg.PARAMETER_MISSING_MESSAGE
        })
    } else {
        restaurent.findOne({ _id: user_id }).exec(function (err, verifiedResult) {

            if (verifiedResult.mobile_number == mobile_number) {
                if (verifiedResult.otp == otp) {
                    restaurent.update({ _id: user_id }, { is_otp_verified: 1, profile_status: 2 }, function (err, otpupdateResult) {
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
    var restaurent = req.collection_restaurent;
    if (typeof mobile_number === "undefined" || !mobile_number || typeof user_id === "undefined" || !user_id) {

        res.status(status.PARAMETER_MISSING_STATUS).json({
            message: msg.PARAMETER_MISSING_MESSAGE
        })
    } else {
        restaurent.findOne({ _id: user_id }).exec(function (err, resendotpResult) {
            console.log(resendotpResult);
            if (err) {
                res.status(status.ERROR_IN_EXECUTION).json({ message: err })
            } else {
                if (resendotpResult.mobile_number == mobile_number) {
                    restaurent.update({ _id: user_id }, { otp: "0000" }, function (err, otpupdateResult) {
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
    var restaurent = req.collection_restaurent;
    var token = req.Collection_token;
    if (typeof mobile_number === "undefined" || !mobile_number || typeof password === "undefined" || !password) {

        res.status(status.PARAMETER_MISSING_STATUS).json({
            message: msg.PARAMETER_MISSING_MESSAGE
        })
    } else {

        restaurent.findOne({ mobile_number: mobile_number }).exec(function (err, loginstatusResult) {
            if (err) {
                res.status(status.ERROR_IN_EXECUTION).json({ message: err })
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
        })
    }

})

// change mobile number====================

router.post("/change_number",function(req,res){
    console.log(req.body);
    var user_id = req.body.user_id;
    var old_mobile_number = req.body.old_mobile_number;
    var new_mobile_number = req.body.new_mobile_number;
    var restaurent = req.collection_restaurent;
    if (typeof old_mobile_number === "undefined" || !old_mobile_number 
    || typeof new_mobile_number === "undefined" || !new_mobile_number || typeof user_id === "undefined" || !user_id) {

        res.status(status.PARAMETER_MISSING_STATUS).json({
            message: msg.PARAMETER_MISSING_MESSAGE
        })
    } else {
        restaurent.find({mobile_number:new_mobile_number}).exec(function(err,restResult){
            if (err) {
                res.status(status.ERROR_IN_EXECUTION).json({ message: err })
            } else {
               if(restResult.length == 0){
                restaurent.update({_id:user_id},{mobile_number:new_mobile_number},function(err,updatenumberResult){
                    if (err) {
                        res.status(status.ERROR_IN_EXECUTION).json({ message: err })
                    } else {
                        res.status(status.SUCCESS_STATUS).json({  message: msg.UPDATE_MOBILE_NUMBER })
                    }
                })
               } else {
                res.status(status.ALREADY_EXIST).json({ message: msg.USER_EXIST })
               }
            }
        })

       
    }
});




module.exports = router;