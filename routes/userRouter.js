const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");



// Router for signing up
userRouter.get("/sign-up", userController.userSignUpGet);
userRouter.post("/sign-up", userController.userSignUpPost);

// Router for user to log in




module.exports = userRouter;