/*
 * @Author: Krishna 
 * @Date: 2018-04-20 10:50:22 
 * @Last Modified by: Krishna
 * @Last Modified time: 2018-04-20 18:29:33
 */

//dependencies
const express = require("express");
var router = express.Router();
const cities = require("cities-list");
const isc = require("indian-states-cities");



router.get("/", (req, res) => {
    // console.log(cities) 
    console.log(cities["london"]) // 1 
    // console.log(cities["something else"])
    res.send("api2");
})

module.exports = router;