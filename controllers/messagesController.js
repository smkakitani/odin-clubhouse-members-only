const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");



// Validation
const validateMessage = [
  body("title").trim()
    .isLength({ min: 1, max: 255 }).withMessage("Message's title must be between 1 and 255 characters."),
  body("messageText").trim()
    .isLength({ min: 1, max: 500 }).withMessage("Your message must be less than 500 characters.")
];



// 
async function messagesCreateGet(req, res, next) {
  res.render("messages/message-form", {
    title: "New message",
  });
}

const messagesCreatePost = [
  validateMessage,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("messages/message-form", {
        title: "New message",
        errors: errors.array(),
      });
    }

    next();
  }, async (req, res, next) => {
    const { id } = req.user;
    const { title, messageText } = matchedData(req);

    await db.addMessage({ userId: id, title, text: messageText });

    res.redirect("/");
  }
];

async function messagesDeleteMsgPost(req, res, next) {
  const { messageId } = req.params;

  await db.deleteMessageById(messageId);

  res.redirect("/");
}



module.exports = {
  messagesCreateGet,
  messagesCreatePost,
  //////
  messagesDeleteMsgPost,
};