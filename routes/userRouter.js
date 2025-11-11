const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");
const passport = require("passport");



// Router for signing up
userRouter
  .route("/sign-up")
  .get(userController.userSignUpGet)
  .post(userController.userSignUpPost);

// Router for user to log in
userRouter
  .route("/log-in")
  .get(userController.userLogInGet)
  .post(userController.userLogInPost);

// Router for logging
userRouter.get("/log-out", userController.userLogOutGet);



module.exports = userRouter;