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
  // .post((req, res, next) => {
  //   passport.authenticate("local", {
  //     successRedirect: "/",
  //     failureRedirect: "/",
  //     successMessage: "success!!!",
  //     failureMessage: "fail authenticating",
  //   })
  // })
// userRouter.get("/", userController.userLogOutGet);

userRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


// userRouter.post("/log-in", 
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/"
//   })
// );



module.exports = userRouter;