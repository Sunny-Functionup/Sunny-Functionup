const express = require('express');
const res = require('express/lib/response');
const router = express.Router();

router.get('test-me', function(req, res) {
    res.send('My first of all api')
});


// 1. api to fetch all the movies from any array

router.get('/Movies', function(req, res) {
    res.send('["Venom","Dabang","Singham","Run","Endgame"]')
});

//2. Api to fetch all moviesby indexid from array & if the index is greater than the valid maximum value a message is returned that tells the user to use a valid index in an error message.


router.get('/Movies/:movieid', function(req, res) {
    
    movie1=["Venom","Dabang","Singham","Run","Endgame"]
    let value = req.params.movieid;
    if (value>movie1.length-1){
        res.send ("this file doesnot exist")
     } else{
            res.send(movie1[value])
        }
    
});
// 3. this api fetch all movies from array of objects

router.get('/movie3', function (req ,res) {
    res.send([ {id: 1,name: 'The Shining'}, {id: 2,name: 'insidious'},{id: 3,name: 'Mib'},{id: 4,name: 'surahi'},{id: 5,name: 'god father'}])
});


//4.Write another api called GET /films. Instead of an array of strings define an array of movie objects this time. Each movie object should have values - id, name.

router.get('/films/:filmid', function(req, res){
    let movie2=[ {id: 1,name: 'The Shining'}, {id: 2,name: 'Incendies'}, {id: 3, name: 'Rang de Basanti'}, {id: 4, name: 'Finding fanny'}]  
    let value= req.params.filmid;   
    let found=false;
    for(i=0;i<movie2.length;i++){
        // console.log(typeof movie2[i].id)
        // console.log(movie2[i])
        if( movie2[i].id==value){
            found=true
            res.send(movie2[i])
            break
        }
    }
    if(found==false){
    res.send("no movie exists with this id")}
});

module.exports = router
