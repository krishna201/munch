/*
 * @Author: Krishna 
 * @Date: 2018-04-23 11:31:18 
 * @Last Modified by: Krishna
 * @Last Modified time: 2018-05-03 13:41:33
 */
const express = require("express");
const router = express.Router();
var crypto = require('crypto');
var rand = require('csprng');
// const user = require("../config/models");
const msg = require("./message");


router.get('/',function(req,res){
    res.status(200).json("user page");
    // res.status(200).json(msg.register.success)
})


router.post("/register", (req, res) => {
    console.log(req.body);
    var mobileNo = req.body.mobileNo;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var fcmId = req.body.fcmId;
    var password = req.body.password;
    var isNewsletter = req.body.newsLetter;
    var term_conditon = req.body.term_condition;

    if (typeof mobileNo === "undefined" || !mobileNo || typeof dob === "undefined" || !dob || typeof fcmId === "undefined" || !fcmId || typeof password === "undefined" || !password || typeof gender === "undefined" || !gender ||
     typeof isNewsletter === "undefined" || !isNewsletter ||typeof term_conditon === "undefined" || !term_conditon) {

        res.status(400).json({
            message:msg.commonMsg.parameterMessing
        })
    } else {

        var x = mobileNo;
        if (mobileNo.length === 10) {
            if (
                password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) &&
                password.length >= 8 &&
                password.match(/[0-9]/) &&
                password.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)
            ) {
                var newuser = new user({
                    mobileNo: mobileNo,
                    dob:dob,
                    fcmId: fcmId,
                    password: password,
                    gender: gender,
                    isNewsletter:isNewsletter,
                    termCondition:term_conditon
                    
                });
    
                user.find({ mobileNo: mobileNo }, function(err, users) {
                    var len = users.length;
    
                    if (len == 0) {
                        newuser.save(function(err) {
                           

                            res.status(200).json({

                                message:msg.register.success
                            })
                        });
                    } else {
                       


                        res.status(409).json({
                            message:msg.register.allReadyExistMobile
                        })
                        
                    }
                });
            } else {
                
                res.status(201).json({
                    message:msg.register.passwordWeek
                })
                
            }
        } else {
            
            res.status(203).json({
                message:msg.register.invalidMObile
            })
        }


    }

   
});


/// USER LOGIN=============================================================================

router.post('/login', (req, res) => {
    console.log(req.body);
    var mobileNo = req.body.mobileNo;
    var password = req.body.password;

    if (typeof mobileNo === "undefined" || !mobileNo  || typeof mobileNo === "undefined" || !mobileNo ) {

        res.status(404).json({
            message:msg.commonMsg.parameterMessing
        })
    } else {
        user.find({ mobileNo: mobileNo }, function(err, users) {
            if (users.length !== 0) {
                valuevalue
                var userid = users[0]._id;
               
                var passworddata = users[0].password;
    
                if (passworddata == password) {
                   
                    res.status(200).json({
                        message:msg.login.success
                    })
                } else {
                  
                    res.status(406).json({
                        message:msg.login.invalidvaluePwd
                    })
                }
            } else {
                
                res.status(404).json({
                    message:msg.login.mobileNotExist
                })
            }
        });

        value
    }

});


// Add new address=================================================

router.post("/add_new_address",function(req,res){value
    var user_id = req.body.user_id;
    var addressName = req.body.addressName;
   var addressLine1 = req.body.addressLine1;
   var addressLine2 = req.body.addressLine2;
   var area = req.body.area;
   var city = req.body.city;
   var postalCode = req.body.postalCode;
   var landmarks = req.body.landmarks;



   if (typeof addressName === "undefined" || !addressName  || typeof user_id === "undefined" || !user_id 
   || typeof addressLine1 === "undefined" || !addressLine1
   || typeof addressLine2 === "undefined" || !addressLine2 || typeof area === "undefined" || !area
   || typeof city === "undefined" || !city  || typeof postalCode === "undefined" || !postalCode
   || typeof landmarks === "undefined" || !landmarks) {

    res.status(404).json({
        message:msg.commonMsg.parameterMessing
    })
} else {
    var userAddress = {
        addressName : addressName,
        addressLine1 : addressLine1,
        addressLine2 : addressLine2,
        area:area,
        city:city,
        postalCode : postalCode,
        landmarks:landmarks
    }

    user.update({ _id: user_id }, {
        $push: {
           
            address: userAddress
        }
    }, (err, updateResult1) => {
        if(err){
            res.status(404).json({
                message:msg.commonMsg.error
            })
        } else {
            res.status(200).json({
                message:msg.addNewAddress.success
            });
        }

    })

    
}
});


//get user address =====================================================
router.get("/get_addresses/:user_id",function(req,res){
    console.log(req.params)
    var user_id = req.params.user_id;
    user.findOne({_id:user_id},function(err,userResult){
        if(err){
            res.status(404).json({
                message:msg.commonMsg.error
            })
        } else {
            res.status(200).json({
                message:msg.commonMsg.success,
                response:userResult.address
            })
        }
    })
})




module.exports = router;