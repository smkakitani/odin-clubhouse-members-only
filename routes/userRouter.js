const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");



// Router for signing up
userRouter
  .route("/sign-up")
  .get(userController.userSignUpGet)
  .post(userController.userSignUpPost)

// Router for user to log in




module.exports = userRouter;