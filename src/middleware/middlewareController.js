const mid1 = function(req,res,next){
    let input = req.headers.isfreeappuser;
    if(!input){
        res.send("request is missinga mandatory header")
    }else{
        next();
    }
}
module.exports.mid1 = mid1