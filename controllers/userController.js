// Express validation
const { body, validationResult, matchedData } = require("express-validator");

// Passport
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

// Hash password
const bcrypt = require("bcryptjs");
const db = require("../db/queries");



// Validation
const secretPasscode = "WORSHIPCATS";
const secretPasscodeAdmin = "WORSHIPCATSADMIN";
const alphaErr = 'must only contain letters or "-".';
const lengthErr = "must be between 2 and 32 characters.";
const isSamePassword = async (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('a');
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

const validatePasscode = [
  body("passcode").trim().toUpperCase()
    .notEmpty().withMessage("Missing secret passcode.")
    .isAlpha().withMessage("Our secret passcode contain only letters!")
    .contains('cat', { ignoreCase: true }).withMessage("Our secret passcode contains 'cat'!")
    // .equals(secretPasscode).withMessage("Incorrect passcode."),
    .matches(/^WORSHIPCATS(?:admin)?$/i).withMessage("Incorrect passcode."),
];

// Passport - LocalStrategy setup
// Passport search for 'username' and 'password' as default, but it can take options so we can tell which field names to look for
const customFields = {
  usernameField: 'email',
};

passport.use(
  new LocalStrategy(customFields, async (username, password, done) => {
    try {
      const user = await db.getUserByEmail(username);

      if (!user) {
        // User returns 'undefined'
        return done(null, false, { message: "Incorrect username" });
      }

      // Verify hashed password from bcryptjs
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// To make sure user is logged in and to allow them to stay logged in
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);

    done(null, user);
  } catch (err) {
    console.error(err);
    done(err);
  }
});



// 
function userSignUpGet(req, res) {
  res.render("user/sign-up-form", {
    title: "Sign-up",
  });
}

const userSignUpPost = [
  validateUser,
  async (req, res, next) => {
    const { firstName, lastName, email } = req.body; // To keep old input value
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).render("user/sign-up-form", {
        title: "Sign-up",
        oldInput: { firstName, lastName, email },
        errors: errors.array(),
      });
    }

    next();
  }, async (req, res, next) => {    
    try {
      const { firstName, lastName, email, password } = matchedData(req);
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.addUser({ firstName, lastName, email, password: hashedPassword });

      res.redirect("/");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
];

async function userLogInGet(req, res) {
  const errorMsg = req.session.messages;
  req.session.messages = [];

  res.render("user/log-in", {
    title: "Log in",
    error: errorMsg,
  });
}

async function userLogInPost(req, res, next) {
  // Function must return passport.authenticate
  return passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "./log-in",
    failureMessage: true,
  })(req, res, next);
}

async function userLogOutGet(req, res, next) {
  return req.logout((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.redirect("/");
  });
}

function userJoinClubGet(req, res, next) {
  res.render("user/join-club", {
    title: "Join the club",
  });
}

const userJoinClubPost = [
  validatePasscode,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if(!errors.isEmpty()) {
        return res.status(400).render("user/join-club", {
          title: "Join the club",
          errors: errors.array({ onlyFirstError: true }),
        });
      }      

      next();
    } catch (err) {
      return next(err);
    }
  }, async (req, res, next) => {
    try {
      const { passcode } = matchedData(req);
      const userId = req.user.id;

      if (passcode.toUpperCase() === secretPasscode) {
        await db.updateMembership(userId);

        res.redirect("/");
      }
      if (passcode.toUpperCase() === secretPasscodeAdmin) {
        await db.updateAdmin(userId);

        res.redirect("/");
      }
    } catch (err) {
      console.error(err);
    }    
  }
];



module.exports = {
  userSignUpGet,
  userSignUpPost,
  //////
  userLogInGet,
  userLogInPost,
  userLogOutGet,
  //////
  userJoinClubGet,
  userJoinClubPost,
};