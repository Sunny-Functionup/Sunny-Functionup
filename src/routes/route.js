const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const app = express.Router();


let players = [ 
    {
          
         "name": "poonam",
         "dob": "1/1/1995",
         "gender":"female",
         "city": "jalandhar",
         "sports": [ " swimming"],
         "bookings": [

            {
                "bookingNumber":1,
                "sportsId":"",
                "centreId":"",
                "type":"private",
                "slot": "12345",
                "bookedOn":"31/08/2021",
                "bookedFor":" 01/09/2021"
            },
            {
                "bookingNumber":2,
                "sportsId":"",
                "centreId":"",
                "type":"private",
                "slot": "123456",
                "bookedOn":"31/08/2021",
                "bookedFor":" 03/09/2021"
            }

         ]
  },
   
  {
    "name": "sumit",
    "dob": "1/3/1998",
    "gender":"male",
    "city": "jalandhar",
    "sports": [ " swimming"],
    "bookings": [   ]
},

  {

    "name": "sonam",
    "dob": "1/2/1999",
    "gender":"female",
    "city": "jalandhar",
    "sports": [ " swimming"],
    "bookings": [  ]
    }

    ]



// Part 1 ==>to add a new player in team====================================

let length = players.length;

router.post('/player',function(req,res){

let element = req.body.nplayer.name;
let newelement = req.body.nplayer
for (let i=0;i<length;i++){
    if(element === players[i].name ){
        console.log(element)
        res.send("player already exists")
        
   
}
else if (i === length-1){

    players.push(element)
    console.log(element)
    res.send({data :players , status : true})
    }
}

})

module.exports = router;