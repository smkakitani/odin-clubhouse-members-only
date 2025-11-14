// Access to variables set in .env file via 'process.env.VARIABLE_NAME'
require("dotenv").config();

// Server
const path = require("node:path");
const express = require("express");
const app = express();

// Authentication
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");

// Import routers
const indexRouter = require("./routes/indexRouter");
const userRouter = require("./routes/userRouter");
const messagesRouter = require("./routes/messagesRouter");



// Enables EJS for views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Enable req.body to parse client's output
app.use(express.urlencoded({ extended: true }));

// Enables express-session to store data 
app.use(session({
  store: new pgSession({
    // Connection to pool
    pool: pool, 
    // Instruct connect-pg-simple to create table for Session to store data
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(passport.session());



// Custom middleware to access current user from deserializeUser function
app.use((req, res, next) => {
  res.locals.currentUser = req.user;

  next();
});

// Imported routes
app.use("/user", userRouter);
app.use("/messages", messagesRouter)
app.use("/", indexRouter);



// Handling errors
app.use((err, req, res, next) => {
  console.error(err);
});



// 
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Clubhouse App - listening on port ${PORT}!`);
});