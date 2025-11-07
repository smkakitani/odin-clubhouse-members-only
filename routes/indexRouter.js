const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();



// Route for displaying Home
indexRouter.get("/", indexController.indexHomeGet);


module.exports = indexRouter;