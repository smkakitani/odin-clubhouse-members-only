// dotenv
require("dotenv").config();

// Server
const path = require("node:path");
const express = require("express");
const app = express();

// Import routers
const indexRouter = require("./routes/indexRouter");



// Enables EJS for views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Enable req.body to parse client's output
app.use(express.urlencoded({ extended: true }));



// Imported routes

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