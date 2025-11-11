
const { body, validationResult, matchedData } = require("express-validator");

// Passport
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

// Hash password
const bcrypt = require("bcryptjs");
const db = require("../db/queries");



// Validation
const alphaErr = 'must only contain letters or "-".';
const lengthErr = "must be between 2 and 32 characters.";
const isSamePassword = async (value, { req }) => {
  // console.log(value, value === req.body.password/* , req.body */)
  if (value !== req.body.password) {
    // console.log(value);
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
const customFields = {
  usernameField: 'email',
};

passport.use(
  new LocalStrategy(async (username, password, done) => {
    // console.log('calling from LocalStrat', password);
    try {
      const user = await db.getUserByEmail(username);
      // console.log(password, user);      

      if (!user) {
        // user probably returning 'undefined'
        console.log("username do not match!!!");
        return done(null, false, { message: "Incorrect username" });
      }

      // Compare hashed password from bcryptjs
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.log("passwords do not match!!!");
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  // console.log("calling from serializeUser!!!");
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    // console.log("calling from deserializeUser: ", user.id);

    done(null, user);
  } catch (err) {
    console.error(err);
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
    try {
      // const { firstName, lastName, email, password } = req.params;
      const { firstName, lastName, email, password } = matchedData(req);

      // console.log("password from POST: ", password, typeof password);
      const hashedPassword = await bcrypt.hash(password, 10);
      // console.log(hashedPassword, typeof hashedPassword);

      await db.addUser({ firstName, lastName, email, password: hashedPassword });

      res.redirect("/");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
];

async function userLogInGet(req, res) {
  res.render("log-in", {
    title: "Log in",
  });
}

async function userLogInPost(req, res, next) {
  console.log("authenticating...", req.body);
  // passport.authenticate("local", (err, user, info, status) => {
  //   if (err) {
  //     console.error(err);
  //     return next(err);
  //   }
  //   console.log('User: ', user, 'Info: ', info, 'Status: ', status);
  //   res.redirect('/');
  // })
  return passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "./log-in",
    // successMessage: "success!!!",
    failureMessage: true,
  })(req, res, next);
}

async function userLogOutGet(req, res, next) {
  console.log('should log out ;-;', req);
  return req.logout((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.redirect("/");
  });
}



module.exports = {
  userSignUpGet,
  userSignUpPost,
  userLogInGet,
  userLogInPost,
  userLogOutGet,
};