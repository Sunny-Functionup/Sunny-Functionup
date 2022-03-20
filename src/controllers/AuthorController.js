const AuthorModel = require('../models/AuthorModel')
const jwt = require('jsonwebtoken')
// =======================================Function declared here==========================================
const isValid = function (value) {
  if (typeof value === 'undefined' || value === null)
    return false
  if (typeof value === 'string' && value.trim().length === 0)
    return false
  else
    return true;
}
const isTitleValid = function (title) {
  return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}
const BodyReqValid = function (requestBody) {
  return Object.keys(requestBody).length > 0
}
// ======================================================================================================
const CreateAuthor = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!BodyReqValid(requestBody)) {
      
      res.status(400).send({ status: false, message: 'invalid input,do provide author details' })
      return
    }
    // Extracting params
    const { fname, lname, title, email, password } = requestBody;

    // Validation from here-------------------------------------------------------------------------------
    if (!isValid(fname)) {
      res.status(400).send({ status: false, message: 'first name needed' })
      return
    }
    if (!isValid(lname)) {
      res.status(400).send({ status: false, message: 'last name needed' })
      return
    }
    if (!isValid(title)) {
      res.status(400).send({ status: false, message: 'title needed' })
      return
    }
    if (!isTitleValid(title)) {
      res.status(400).send({ status: false, message: `title should be miss, mrs, mr ` })
      return
    }
    if (!isValid(email)) {
      res.status(400).send({ status: false, message: `email  needed` })
      return
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      res.status(400).send({ status: false, message: `email should be a valid one` })
      return
    }
    if (!isValid(password)) {
      res.status(400).send({ status: false, message: `password needed` })
      return
    }
    const isEmailUsed = await AuthorModel.findOne({ email });
    if (isEmailUsed) {
      res.status(400).send({ status: false, message: `${email} email already in use` })
      return
    }
    // ends-----------------------------------------------------------------------------------------------------
    const authorData = { fname, lname, title, email, password }

    const newAuthor = await AuthorModel.create(authorData);
    
    res.status(201).send({ status: true, message: `new author created`, data: newAuthor });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}
// ---------------------------------------------------------------------------------------------------------------
const LoginAuthor = async function (req, res) {
  try {
    const requestBody = req.body;
    const { email, password } = requestBody;
    if (!BodyReqValid(requestBody)) {
      
      res.status(400).send({ status: false, message: 'invalid request ,do provide login detail properly' })
      return
    }
    
    if (!isValid(email)) {
      res.status(400).send({ status: false, message: `email needed` })
      return
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      res.status(400).send({ status: false, message: `email should be a valid` })
      return
    }
    if (!isValid(password)) {
      res.status(400).send({ status: false, message: `password needed` })
      return
    }
    // Validation ends
    const author = await AuthorModel.findOne({ email, password });
    if (!author) {
      res.status(401).send({ status: false, message: `invalid login data` });
      return
    }
    const token = await jwt.sign({
      authorId: author._id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
    }, 'functionup-thorium')

    res.header('x-api-key', token);

    res.status(200).send({ status: true, message: `author login is successfull now`, data: { token } });
  } catch (error) {

    res.status(500).send({ status: false, message: error.message });
  }
}
module.exports.CreateAuthor = CreateAuthor
module.exports.LoginAuthor = LoginAuthor