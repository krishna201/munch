/*
 * @Author: Krishna 
 * @Date: 2018-04-19 19:32:58 
 * @Last Modified by: Krishna
 * @Last Modified time: 2018-05-03 12:58:38
 */

const express = require("express");
const router = express.Router();
const user = require("../config/models");
const msg = require("./message");
// const cityArea = require('../config/cityandarea');

const trans = require('../config/transationdb');
const company = require("../config/companydb");
// const companytrans = require('../config/companytrans');
const sendmail = require("sendmail")();

router.get('/', (req, res) => {
    res.send("api1");
});


// ======================== resend otp ====================================

router.post("/generate_otp",function(req,res){
    const mobileNo = req.body.mobileNo;
    const userid = req.body.userid;
})

//=========== otp verification =====================================


router.post("/otp_verification",function(req,res){
    const otp = req.body.otpNo;
    const mobileNo = req.body.mobileNo;
    const userid = req.body.userid;

    if (typeof otp === "undefined" || !otp || typeof mobileNo === "undefined" || !mobileNo || typeof userid === "undefined" || !userid) {
       
        res.status(400).json({
            message:msg.commonMsg.parameterMessing
        })
    } else {
        user.findOne({_id:userid},function(err,userResult){
            if(userResult.otp === otp){
               

                res.status(200).json({
                    message:msg.otpVerification.success
                })
            } else {
                res.status(203).json({
                    message:msg.otpVerification.invalidOtp
                })
            }
        })

    }
})

//============================edit user Account =============
router.post("/edit_user_account",function(req,res){
    const userid = req.body.userid;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailId = req.body.emailId;
    const gender = req.body.gender;
    const dob = req.body.dob;

    if (typeof userid === "undefined" || !userid ||typeof firstName === "undefined" || !firstName || typeof lastName === "undefined" || !lastName || typeof emailId === "undefined" || !emailId || typeof gender === "undefined" || !gender || typeof dob === "undefined" || !dob) {
       
        res.status(400).json({
            message:msg.commonMsg.parameterMessing
        })
    } else {
        user.updateOne({ '_id': userid }, {
            $set: {
                firstName:firstName,
                lastName:lastName,
                emailId :emailId,
                gender:gender,
                dob:dob
            }
        }, function(err, updateResult) {
            if(err){
                res.status(200).json({
                    message: msg.userAccountUpdate.success
                })
            } else {
                res.status(200).json({
                    message:msg.commonMsg.error + err
                })
            }

        })


    }

});

//============================change password =======================
router.post("/change_password",function(req,res){
    const currentPassword = req.body.currentPassword;
    const userid = req.body.userid;
    const newpassword = req.body.newpassword;

    if (typeof userid === "undefined" || !userid ||typeof currentPassword === "undefined" || !currentPassword || typeof newpassword === "undefined" || !newpassword ) {
        
        res.status(400).json({
            message:msg.commonMsg.parameterMessing
        })
    } else {
        user.findOne({ mobileNo: mobileNo }, function(err, userResult) {
            if(userResult.password === currentPassword){transationdb
                user.updateOne({ '_id': userid }, {
                    $set: {
                        password:newpassword
                    }
                }, function(err, updatepwdResult) {
                    if(err){
                       
                        res.status(500).json({
                            message:msg.commonMsg.error + err
                        })
                    } else {transationdb
                        
                         res.status(200).json({
                            message:msg.changePassword.success
                        })
                    }
        
                })


            } else {
                 

                  res.status(203).json({
                    message:msg.changePassword.invalidPwd
                })
            }
        })

    }

})

/// city and area ===============================================================================

router.get("/get_city",function(req,res){
    
res.status(200).json(cityArea.city);
})

router.get("/get_area/:city",function(req,res){
    console.log(req.params)
    
    var city1 = req.params.city;
    console.log(city1);
    console.log(cityArea.noida)
    res.status(200).json(cityArea.noida);
    })





///==========================================








router.post('/after_login_status', (req, res) => {
    console.log(req.body);
    var user_id = req.body.user_id;
    var token = req.body.token;
    if (typeof user_id === "undefined" || !user_id || typeof token === "undefined" || !token) {
        console.log("parameter missing");
        res.json({ success: 0, response: "parameter missing" });
    } else {
        user.findOne({ _id: user_id }, function(err, userResult) {
            if (userResult.token !== token) {
                res.json({ success: -1, response: "Invalid token" });
            } else {
                stripe.customers.listCards(userResult.stripeID, function(
                    err,
                    cards
                ) {
                    if (err) {
                        res.json({
                            status: 0,
                            response: "Something err "
                        });
                    } else {
                        console.log(userResult);
                        res.json({
                            status: 1,
                            response: "Success Data",
                            userdata: userResult,
                            userAccountDetails: cards.data,
                        });
                    }
                });
            }
        });
    }
});


//==================== outsection ================================================================


router.post('/logout', function(req, res) {
    var userid = req.body.userid;
    var token = req.body.token;

    user.findOne({ '_id': userid }, function(err, userdata) {
        if (!err) {
            console.log(userdata.token);
            if (userdata.token == token) {
                user.updateOne({ '_id': userid }, {
                    $set: { 'token': "0" }
                }, function(err, results) {

                    console.log("this is token", results);

                    res.json({

                        success: 1,
                        post: {
                            message: "Successfully logout"
                        }
                    });
                });

            } else {
                res.json({
                    success: -1,
                    error: "Invalid Token"
                });

            }


        } else {
            res.json({
                success: 0,
                error: "User doesn't exist"
            });
        }
    });
});


///////===============================================================================================================

router.post('/send_mail', function(req, res) {
    console.log(req.body);
    var tomail = req.body.emailid;
    sendmail({
            from: "crowdfunders@dev2.technokriti.in",
            to: tomail,
            subject: "test sendmail",
            html: "Mail of test sendmail "
        },
        function(err, reply) {
            // console.log(err && err.stack);
            // console.dir(reply);
            console.log("err",err);
            console.log("reply",reply);
            if(err){
                res.json({
                    success:0
                })
            } else {
                res.json({
                     success:1
                })
               
            }
        }
    );
   

})

module.exports = router;