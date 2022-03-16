const AuthorModel = require("../models/AuthorModel")
const jwt = require("jsonwebtoken");



const createAuthor = async function (req, res) {
  let data = req.body;
  let savedData = await AuthorModel.create(data);
  res.send({ msg: savedData });
};

const loginAuthor = async function (req, res) {
  let userName = req.body.email;
  let password = req.body.password;

  let Author = await AuthorModel.findOne({ emailId: userName, password: password });
  if (!Author)
    return res.send({
      status: false,
      msg: "username or the password is not corerct",
    });

  
  let token = jwt.sign(
    {
      AuthorId: Author._id.toString(),
      batch: "thorium",
      organisation: "FUnctionUp",
    },
    "functionup-thorium"
  );
  res.setHeader("x-api-key", token);
  res.send({ status: true, data: token });
};


module.exports.createAuthor = createAuthor
module.exports.loginAuthor=loginAuthor



