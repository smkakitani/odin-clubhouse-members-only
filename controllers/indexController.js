const db = require("../db/queries");



// 
const indexHomeGet = async (req, res) => {
  const messages = await db.getAllMessages();
    // console.log('From index: ', messages);
    
  res.render("index", {
    title: "Neko House",
    user: req.user,
    messages: messages,
  });
  // res.send('~Clubhouse!!!~');
};

module.exports = {
  indexHomeGet,
};