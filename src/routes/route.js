let obj= require('./logger1/logger')
let help= require('./util/helper')
const express = require('express');
const { chunk } = require('lodash');
const { tail } = require('lodash');
const lodash = require('lodash')
const {union} = require('lodash');
const {fromPairs} = require('lodash')


const router = express.Router();

router.get('/hi-there', function (req, res) {
    help.currentdate('thorium')
    console.log(help)
   res.send('welcome to functionup. im sunny chakrawarty and a part of functionup thorium')
});



router.get('/Hello', function (req, res) {
    let month= ["january", "February", "march", "april", "May", "June", "July", "august", "sept", "oct",  "nov", "dec"]

       console.log(lodash.chunk(month,4)) 
    res.send('welcome to functionup. im sunny chakrawarty and a part of functionup thorium')
});

router.get('/Hello3', function (req, res) {
    let movie= [['horror','The Shining'],['drama','Titanic'],['thriller','Shutter Island'],['fantasy','Pans Labyrinth']]

       console.log(lodash.fromPairs(movie)) 
    res.send('welcome to functionup. im sunny chakrawarty and a part of functionup thorium')
});


router.get('/Hello2', function (req, res) {
    
    let arr1= [1,2,3,4,5]
    let arr2= [5,6,7,8,9]
    let arr3= [9,10,11,12,13]
    let arr4= [13,14,15,16,17]
    let arr5= [17,18,19,20,21]
   
    console.log(lodash.union(arr1,arr2,arr3,arr4,arr5)) 
    res.send('welcome to functionup. im sunny chakrawarty and a part of functionup thorium')
});

router.get('/Hello1', function (req, res) {
    let oddNumber= [1,3,5,7,9,11,13,15,17,19]
    

       console.log(lodash.tail(oddNumber)) 
    res.send('welcome to functionup. im sunny chakrawarty and a part of functionup thorium')
});

module.exports = router;
// adding this comment for no reason

//router.get('/test-me', function (req, res) {
    //obj.log('thorium')
    //console.log(obj.url)
   // res.send('welcome to functionup. im sunny chakrawarty and a part of functionup thorium')
//});






