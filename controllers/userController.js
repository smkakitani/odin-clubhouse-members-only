const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

// Passport
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;



// Validation
const alphaErr = 'must only contain letters or "-".';
const lengthErr = "must be between 2 and 32 characters.";
const isSamePassword = async (value, { req }) => {
  console.log(value, value === req.body.password/* , req.body */)
  if (value !== req.body.password) {
    console.log(value);
    throw new Error('a');
    // return false;
  }
  return true;
};

const validateUser = [
  body("firstName").trim()
    .isAlpha(['pt-BR'], { ignore: " -" }).withMessage(`First name ${alphaErr}`)
    .isLength({ min: 2, max: 32 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 2, max: 32 }).withMessage(`Last name ${lengthErr}`),
  body("email").trim()
    .isEmail().withMessage("Not a valid e-mail address.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must have 6 characters at minimum."),
  body("passwordConfirmation")
    .custom(isSamePassword).withMessage("Must be same as password."),
];



// Passport - LocalStrategy
passport.use(
  new LocalStrategy(async (firstName, lastName, email, password) => {
    try {
      const user = await db.getUserByEmail(email);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});



// 
function userSignUpGet(req, res) {
  res.render("sign-up-form", {
    title: "Sign-up",
  });
}

const userSignUpPost = [
  validateUser,
  async (req, res, next) => {
    const { firstName, lastName, email } = req.body;
    const errors = validationResult(req);
    // console.log(errors);

    if(!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        title: "Sign-up",
        oldInput: { firstName, lastName, email },
        errors: errors.array(),
      });
    }

    next();
  },
  async (req, res, next) => {
    const { firstName, lastName, email, password } = req.params;
    try {
      await db.addUser({ firstName, lastName, email, password });

      res.redirect("/");
    } catch (err) {
      return next(err);
    }

    // res.send("user sending data to DB...");
  }
];



module.exports = {
  userSignUpGet,
  userSignUpPost,

};