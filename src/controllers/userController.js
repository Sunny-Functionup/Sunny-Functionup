
const userModel = require("../models/userModel");
//part 1
const createUser = async function (req,res) {
 
  let data = req.body;
  let savedData = await userModel.create(data);
  
  res.send({ msg: savedData });
}
//part 2
const loginUser = async function (req, res) {
  let userName = req.body.emailId;
  let password = req.body.password;

  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.send({
      status: false,
      msg: "username or the password is not corerct",
    });

  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "thorium",
      organisation: "FUnctionUp",
    },
    "functionup-thorium"
  );
  
  res.send({ status: true, data: token });
};

//part 3

const getUserData = async function (req, res) {
  

  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.send({ status: false, msg: "No such user exists" });

  res.send({ status: true, data: userDetails });
};


//part 4
const updateUser = async function (req, res) {
  
  
  let userId = req.params.userId;
  let user = await userModel.findById(userId);
 
  if (!user) {
    return res.send("No such user exists");
  }


  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, {$set:{age:25}});
  res.send({ status: "updated user", data: updatedUser });
};


//part 5 
let deleteUser = async function(req,res){

 
let userId=req.params.userId
let user = await userModel.findOneAndUpdate({_id:userId},{$set:{isDeleted:true}})
res.send ({status : "deleted" , data: user})


}

module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteUser=deleteUser;
