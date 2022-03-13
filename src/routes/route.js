const express = require('express');
const router = express.Router();

const CowinController= require("../controllers/cowinController")

const MemeController= require("../controllers/MemeController")

const weatherController = require("../controllers/weatherController")



router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

// cowin
router.get("/cowin/states", CowinController.getStates)

router.get("/cowin/districtsInState/:stateId", CowinController.getDistricts)

router.get("/cowin/getByPin", CowinController.getByPin)

router.post("/cowin/getOtp", CowinController.getOtp)

router.get("/cowin/getByDistrict", CowinController.getDistrictSessions)


//meme
router.post("/meme", MemeController.memecreation)

//weather
router.get("/getWeather", weatherController.getWeather)
router.get("/sortCityByTemp", weatherController.sortCityByTemp)

module.exports = router;