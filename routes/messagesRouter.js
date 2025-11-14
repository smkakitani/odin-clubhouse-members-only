const { Router } = require("express");
const messagesRouter = Router();
const messagesController = require("../controllers/messagesController");



// 
messagesRouter
  .route("/new")
  .get(messagesController.messagesCreateGet)
  .post(messagesController.messagesCreatePost);

messagesRouter.post("/:messageId/delete", messagesController.messagesDeleteMsgPost);



module.exports = messagesRouter;