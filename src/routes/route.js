const express = require('express');
const router = express.Router();
const bookController= require("../controllers/bookController")
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/createAuthor",bookController .createAuthor)
router.get("/createPublisher", bookController.createPublisher)
router.get("/createBook1", bookController. createBook1)
router.get("/getBooks", bookController.getBooks)

module.exports = router;