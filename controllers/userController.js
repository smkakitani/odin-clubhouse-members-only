const { render } = require("ejs");
const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");



// Validation
const validateUser = [];



// 
function userSignUpGet(req, res) {
  res.render("sign-up-form", {
    title: "Sign-up",
  });
}

async function userSignUpPost(req, res, next) {
  
  res.send("user sending data to DB...");
}



module.exports = {
  userSignUpGet,
  userSignUpPost,

};